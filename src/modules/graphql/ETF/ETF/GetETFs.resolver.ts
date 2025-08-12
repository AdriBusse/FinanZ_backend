import { MyContext } from "../../../../types/MyContext";
import { ETF } from "../../../../entity/ETF";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver()
export class GetETFsResolver {
  @Query(() => [ETF])
  @UseMiddleware(isAuth)
  async getETFs(@Ctx() ctx: MyContext): Promise<ETF[]> {
    console.log(ctx);

    const user = ctx.res.locals.user;
    const etfs = await ETF.find({ user });
    return etfs;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
