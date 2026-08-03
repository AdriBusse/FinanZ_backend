import { validate } from "class-validator";
import bcrypt from "bcrypt";
import {
  Arg,
  Ctx,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getManager, getRepository, Raw } from "typeorm";
import { User } from "../../../entity/User";
import { UserIdentity } from "../../../entity/UserIdentity";
import { issueAuthToken } from "../../../services/auth-token.service";
import { verifyGoogleIdToken } from "../../../services/google-auth.service";
import { AuthProvider } from "../../../types/AuthProvider";
import {
  GoogleAuthResult,
  GoogleLoginStatus,
} from "../../../types/GoogleAuthResult";
import { MyContext } from "../../../types/MyContext";
import { isAuth } from "../../middleware/isAuth";

const googleIdentityWhere = (subject: string) => ({
  provider: AuthProvider.GOOGLE,
  providerSubject: subject,
});

const findUserByEmail = (email: string): Promise<User | undefined> =>
  User.findOne({
    where: {
      email: Raw((column) => `LOWER(${column}) = :email`, { email }),
    },
  });

const authenticatedResult = (user: User, verifiedEmail: string) => ({
  status: GoogleLoginStatus.AUTHENTICATED,
  token: issueAuthToken(user),
  user,
  verifiedEmail,
});

@Resolver()
export class GoogleAuthResolver {
  @Mutation(() => GoogleAuthResult)
  async googleLogin(@Arg("idToken") idToken: string): Promise<GoogleAuthResult> {
    const google = await verifyGoogleIdToken(idToken);
    const identityRepository = getRepository(UserIdentity);
    const identity = await identityRepository.findOne({
      where: googleIdentityWhere(google.subject),
      relations: ["user"],
    });

    if (identity) {
      identity.providerEmail = google.email;
      identity.lastUsedAt = new Date();
      await identityRepository.save(identity);
      console.info("[Auth] Google login outcome", {
        outcome: GoogleLoginStatus.AUTHENTICATED,
      });
      return authenticatedResult(identity.user, google.email);
    }

    const existingUser = await findUserByEmail(google.email);
    const status = existingUser
      ? GoogleLoginStatus.LINK_REQUIRED
      : GoogleLoginStatus.REGISTRATION_REQUIRED;
    console.info("[Auth] Google login outcome", { outcome: status });
    return { status, verifiedEmail: google.email };
  }

  @Mutation(() => GoogleAuthResult)
  async completeGoogleSignup(
    @Arg("idToken") idToken: string,
    @Arg("username") username: string
  ): Promise<GoogleAuthResult> {
    const google = await verifyGoogleIdToken(idToken);
    const normalizedUsername = username.trim();

    const user = await getManager().transaction(async (manager) => {
      const identityRepository = manager.getRepository(UserIdentity);
      const userRepository = manager.getRepository(User);
      const existingIdentity = await identityRepository.findOne({
        where: googleIdentityWhere(google.subject),
      });
      if (existingIdentity) {
        throw new Error("Google account is already linked");
      }

      const existingEmail = await userRepository.findOne({
        where: {
          email: Raw((column) => `LOWER(${column}) = :email`, {
            email: google.email,
          }),
        },
      });
      if (existingEmail) {
        throw new Error("Email already belongs to a FinanZ account");
      }
      if (await userRepository.findOne({ where: { username: normalizedUsername } })) {
        throw new Error("Username already in use");
      }

      const newUser = userRepository.create({
        username: normalizedUsername,
        email: google.email,
        password: null,
        confirmed: true,
      });
      const validationErrors = await validate(newUser);
      if (validationErrors.length > 0) {
        throw new Error("Username must be between 3 and 255 characters");
      }
      const savedUser = await userRepository.save(newUser);

      await identityRepository.save(
        identityRepository.create({
          userId: savedUser.id,
          provider: AuthProvider.GOOGLE,
          providerSubject: google.subject,
          providerEmail: google.email,
          lastUsedAt: new Date(),
        })
      );
      return savedUser;
    });

    console.info("[Auth] Google signup outcome", {
      outcome: GoogleLoginStatus.AUTHENTICATED,
    });
    return authenticatedResult(user, google.email);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async linkGoogleAccount(
    @Arg("idToken") idToken: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const currentUser: User | undefined = ctx.res.locals.user;
    if (!currentUser) throw new Error("Unauthenticated");
    const google = await verifyGoogleIdToken(idToken);

    await getManager().transaction(async (manager) => {
      const repository = manager.getRepository(UserIdentity);
      const providerIdentity = await repository.findOne({
        where: googleIdentityWhere(google.subject),
      });
      if (providerIdentity) {
        if (providerIdentity.userId !== currentUser.id) {
          throw new Error("Google account is linked to another user");
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
        throw new Error("A different Google account is already linked");
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

    console.info("[Auth] Google link outcome", { outcome: "LINKED" });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async setPasswordForGoogleAccount(
    @Arg("idToken") idToken: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const currentUser: User | undefined = ctx.res.locals.user;
    if (!currentUser) throw new Error("Unauthenticated");
    if (currentUser.password) throw new Error("User already has a password");
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    const google = await verifyGoogleIdToken(idToken);
    const identityRepository = getRepository(UserIdentity);
    const identity = await identityRepository.findOne({
      where: {
        userId: currentUser.id,
        ...googleIdentityWhere(google.subject),
      },
    });
    if (!identity) {
      throw new Error("Google verification does not match the linked account");
    }

    currentUser.password = await bcrypt.hash(newPassword, 12);
    await currentUser.save();
    identity.providerEmail = google.email;
    identity.lastUsedAt = new Date();
    await identityRepository.save(identity);
    console.info("[Auth] Google password outcome", { outcome: "PASSWORD_SET" });
    return true;
  }
}
