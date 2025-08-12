import { LemonAPI } from "./../../../Services/LemonAPI";
import { ETF } from "../../../../entity/ETF";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";

@Resolver(ETF)
export class CreateETFResolver {
  @Mutation(() => ETF)
  @UseMiddleware(isAuth)
  async createETF(
    @Arg("isin") isin: string,
    @Ctx() ctx: MyContext
  ): Promise<ETF> {
    const searchETF = await LemonAPI.searchETF(isin);
    if (!searchETF) {
      throw new Error("Something went wrong while creating the ETF");
    }
    const user = ctx.res.locals.user;
    const etf = new ETF();
    etf.name = searchETF.name;
    etf.title = searchETF.title;
    etf.symbol = searchETF.symbol;
    etf.isin = searchETF.isin;
    etf.wkn = searchETF.wkn;
    etf.user = user;

    await etf.save();
    return etf;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
