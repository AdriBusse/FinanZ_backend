import { MyContext } from "../../../../types/MyContext";
import { ETF } from "../../../../entity/ETF";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(ETF)
export class GetETFResolver {
  @Query(() => ETF, { nullable: true })
  @UseMiddleware(isAuth)
  async getETF(@Arg("id") id: string, @Ctx() ctx: MyContext): Promise<ETF> {
    const user = ctx.res.locals.user;
    const etf = await ETF.findOneOrFail({ id, user });
    return etf;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
