import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    const user =
      gqlCtx?.req?.user ||
      gqlCtx?.res?.locals?.user ||
      gqlCtx?.user;

    if (!user) {
      throw new UnauthorizedException("Unauthenticated");
    }

    return true;
  }
}
