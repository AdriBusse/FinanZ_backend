import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";

@Resolver(User)
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    console.log(ctx.res.locals.user);

    if (!ctx.res.locals.user) {
      console.log("_______________no userid___________________");
      return null;
    }
    return ctx.res.locals.user;
  }
}
