import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../user/entities/user.entity";
import { LoginType } from "./types/login-type";
import { GoogleAuthResult } from "./types/google-auth-result";
import { RegisterInput } from "./inputs/register.input";
import { GqlAuthGuard } from "../common/guards/gql-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { nullable: true })
  async signup(@Args("data") data: RegisterInput): Promise<User> {
    return this.authService.signup(data);
  }

  @Mutation(() => LoginType, { nullable: true })
  async login(
    @Args("username") username: string,
    @Args("password") password: string
  ): Promise<LoginType> {
    return this.authService.login(username, password);
  }

  @Mutation(() => Boolean)
  async logout(): Promise<boolean> {
    return true;
  }

  @Mutation(() => GoogleAuthResult)
  async googleLogin(@Args("idToken") idToken: string): Promise<GoogleAuthResult> {
    return this.authService.googleLogin(idToken);
  }

  @Mutation(() => GoogleAuthResult)
  async completeGoogleSignup(
    @Args("idToken") idToken: string,
    @Args("username") username: string
  ): Promise<GoogleAuthResult> {
    return this.authService.completeGoogleSignup(idToken, username);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async linkGoogleAccount(
    @Args("idToken") idToken: string,
    @CurrentUser() currentUser: User
  ): Promise<boolean> {
    return this.authService.linkGoogleAccount(idToken, currentUser);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async setPasswordForGoogleAccount(
    @Args("idToken") idToken: string,
    @Args("newPassword") newPassword: string,
    @CurrentUser() currentUser: User
  ): Promise<boolean> {
    return this.authService.setPasswordForGoogleAccount(
      idToken,
      newPassword,
      currentUser
    );
  }
}
