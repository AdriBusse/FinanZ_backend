import { MyContext } from "../../../../types/MyContext";
import { ETF } from "../../../../entity/ETF";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(ETF)
export class DeleteETFResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteETF(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = ctx.res.locals.user;
    const etf = await ETF.findOneOrFail({ id, user });

    if (!etf) {
      throw new Error("etf not found");
    }

    await etf.remove();
    return true;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
