import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { UserIdentity } from "../user/entities/user-identity.entity";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { AuthTokenService } from "./services/auth-token.service";
import { GoogleAuthService } from "./services/google-auth.service";
import { GqlAuthGuard } from "../common/guards/gql-auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserIdentity])],
  providers: [
    AuthService,
    AuthResolver,
    AuthTokenService,
    GoogleAuthService,
    GqlAuthGuard,
  ],
  exports: [AuthService, AuthTokenService, GoogleAuthService, GqlAuthGuard],
})
export class AuthModule {}
