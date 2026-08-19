import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, Raw } from "typeorm";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { User } from "../user/entities/user.entity";
import { UserIdentity } from "../user/entities/user-identity.entity";
import { AuthTokenService } from "./services/auth-token.service";
import { GoogleAuthService } from "./services/google-auth.service";
import { AuthProvider } from "./types/auth-provider.enum";
import { GoogleAuthResult, GoogleLoginStatus } from "./types/google-auth-result";
import { LoginType } from "./types/login-type";
import { RegisterInput } from "./inputs/register.input";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserIdentity)
    private readonly userIdentityRepository: Repository<UserIdentity>,
    private readonly authTokenService: AuthTokenService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly dataSource: DataSource
  ) {}

  async signup(data: RegisterInput): Promise<User> {
    const { username, email, password } = data;
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new BadRequestException("Email already in use");
    }

    const existingUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new BadRequestException("Username already in use");
    }

    const user = this.userRepository.create({ username, email, password });
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    await this.userRepository.save(user);
    return user;
  }

  async login(username: string, password: string): Promise<LoginType> {
    if (!username || !password) {
      throw new BadRequestException("Input should not be empty");
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (!user.password) {
      throw new BadRequestException("Wrong Credentials");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new BadRequestException("Wrong Credentials");
    }

    user.lastLogin = new Date();
    await this.userRepository.save(user);

    const token = this.authTokenService.issueAuthToken(user);
    return { user, token };
  }

  async googleLogin(idToken: string): Promise<GoogleAuthResult> {
    const google = await this.googleAuthService.verifyGoogleIdToken(idToken);
    const identity = await this.userIdentityRepository.findOne({
      where: {
        provider: AuthProvider.GOOGLE,
        providerSubject: google.subject,
      },
      relations: ["user"],
    });

    if (identity) {
      identity.providerEmail = google.email;
      identity.lastUsedAt = new Date();
      await this.userIdentityRepository.save(identity);

      identity.user.lastLogin = new Date();
      await this.userRepository.save(identity.user);

      return {
        status: GoogleLoginStatus.AUTHENTICATED,
        token: this.authTokenService.issueAuthToken(identity.user),
        user: identity.user,
        verifiedEmail: google.email,
      };
    }

    const existingUser = await this.userRepository.findOne({
      where: {
        email: Raw((column) => `LOWER(${column}) = :email`, { email: google.email }),
      },
    });

    const status = existingUser
      ? GoogleLoginStatus.LINK_REQUIRED
      : GoogleLoginStatus.REGISTRATION_REQUIRED;

    return { status, verifiedEmail: google.email };
  }

  async completeGoogleSignup(idToken: string, username: string): Promise<GoogleAuthResult> {
    const google = await this.googleAuthService.verifyGoogleIdToken(idToken);
    const normalizedUsername = username.trim();

    const user = await this.dataSource.transaction(async (manager) => {
      const identityRepo = manager.getRepository(UserIdentity);
      const userRepo = manager.getRepository(User);

      const existingIdentity = await identityRepo.findOne({
        where: {
          provider: AuthProvider.GOOGLE,
          providerSubject: google.subject,
        },
      });
      if (existingIdentity) {
        throw new BadRequestException("Google account is already linked");
      }

      const existingEmail = await userRepo.findOne({
        where: {
          email: Raw((column) => `LOWER(${column}) = :email`, { email: google.email }),
        },
      });
      if (existingEmail) {
        throw new BadRequestException("Email already belongs to a FinanZ account");
      }

      const existingUsername = await userRepo.findOne({
        where: { username: normalizedUsername },
      });
      if (existingUsername) {
        throw new BadRequestException("Username already in use");
      }

      const newUser = userRepo.create({
        username: normalizedUsername,
        email: google.email,
        password: null,
        confirmed: true,
        lastLogin: new Date(),
      });

      const validationErrors = await validate(newUser);
      if (validationErrors.length > 0) {
        throw new BadRequestException("Username must be between 3 and 255 characters");
      }

      const savedUser = await userRepo.save(newUser);

      await identityRepo.save(
        identityRepo.create({
          userId: savedUser.id,
          provider: AuthProvider.GOOGLE,
          providerSubject: google.subject,
          providerEmail: google.email,
          lastUsedAt: new Date(),
        })
      );

      return savedUser;
    });

    return {
      status: GoogleLoginStatus.AUTHENTICATED,
      token: this.authTokenService.issueAuthToken(user),
      user,
      verifiedEmail: google.email,
    };
  }

  async linkGoogleAccount(idToken: string, currentUser: User): Promise<boolean> {
    if (!currentUser) {
      throw new UnauthorizedException("Unauthenticated");
    }

    const google = await this.googleAuthService.verifyGoogleIdToken(idToken);

    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(UserIdentity);
      const providerIdentity = await repository.findOne({
        where: {
          provider: AuthProvider.GOOGLE,
          providerSubject: google.subject,
        },
      });

      if (providerIdentity) {
        if (providerIdentity.userId !== currentUser.id) {
          throw new BadRequestException("Google account is linked to another user");
        }
        providerIdentity.providerEmail = google.email;
        providerIdentity.lastUsedAt = new Date();
        await repository.save(providerIdentity);
        return;
      }

      const userIdentity = await repository.findOne({
        where: { userId: currentUser.id, provider: AuthProvider.GOOGLE },
      });
      if (userIdentity) {
        throw new BadRequestException("A different Google account is already linked");
      }

      await repository.save(
        repository.create({
          userId: currentUser.id,
          provider: AuthProvider.GOOGLE,
          providerSubject: google.subject,
          providerEmail: google.email,
          lastUsedAt: new Date(),
        })
      );
    });

    return true;
  }

  async setPasswordForGoogleAccount(
    idToken: string,
    newPassword: string,
    currentUser: User
  ): Promise<boolean> {
    if (!currentUser) {
      throw new UnauthorizedException("Unauthenticated");
    }
    if (currentUser.password) {
      throw new BadRequestException("User already has a password");
    }
    if (newPassword.length < 6) {
      throw new BadRequestException("New password must be at least 6 characters long");
    }

    const google = await this.googleAuthService.verifyGoogleIdToken(idToken);
    const identity = await this.userIdentityRepository.findOne({
      where: {
        userId: currentUser.id,
        provider: AuthProvider.GOOGLE,
        providerSubject: google.subject,
      },
    });

    if (!identity) {
      throw new BadRequestException("Google verification does not match the linked account");
    }

    currentUser.password = await bcrypt.hash(newPassword, 12);
    await this.userRepository.save(currentUser);

    identity.providerEmail = google.email;
    identity.lastUsedAt = new Date();
    await this.userIdentityRepository.save(identity);

    return true;
  }
}
