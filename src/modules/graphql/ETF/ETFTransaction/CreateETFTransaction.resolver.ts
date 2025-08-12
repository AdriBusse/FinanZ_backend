import { LemonAPI } from "./../../../Services/LemonAPI";
import { ETFTransaction } from "../../../../entity/ETFTransaction";
import { ETF } from "../../../../entity/ETF";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../../../types/MyContext";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(ETFTransaction)
export class CreateETFTransactionResolver {
  @Mutation(() => ETFTransaction)
  @UseMiddleware(isAuth)
  async createETFTransaction(
    @Arg("etfId") depotId: string,
    @Arg("invest", { nullable: true }) invest: number,
    @Arg("fee", { nullable: true, defaultValue: 0 }) fee: number,
    @Arg("date", { nullable: true }) date: string,
    @Ctx() ctx: MyContext
  ): Promise<ETFTransaction> {
    const user = ctx.res.locals.user;
    const etf = await ETF.findOneOrFail(
      { id: depotId, user },
      { relations: ["transactions"] }
    );
    const lastquote = await LemonAPI.lastQuotes(etf.isin);
    if (!lastquote) {
      throw new Error(
        "Something went wrong while creating the ETFTransaction (external Api didnt response)"
      );
    }

    const etfTransaction = new ETFTransaction();
    etfTransaction.invest = invest ? invest : 0;
    etfTransaction.fee = fee ? fee : 0;
    etfTransaction.amount = invest
      ? parseFloat((invest / lastquote.a).toFixed(2))
      : 0;

    //how many total pices of the etf you own
    let totalAmount = etf.transactions.reduce((acc, cur) => {
      return acc + cur.amount;
    }, 0);
    totalAmount += etfTransaction.amount;

    etfTransaction.value = parseFloat((totalAmount * lastquote.a).toFixed(2));
    etfTransaction.etf = etf;
    etfTransaction.createdAt = date ? new Date(date) : new Date();

    etfTransaction.user = user;

    await etfTransaction.save();
    return etfTransaction;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
