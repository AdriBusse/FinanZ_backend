import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    if (gqlCtx) {
      return gqlCtx.req?.user || gqlCtx.res?.locals?.user || gqlCtx.user;
    }
    const req = context.switchToHttp().getRequest();
    return req?.user || req?.res?.locals?.user;
  }
);
