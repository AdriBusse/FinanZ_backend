import { SavingDepot } from "../../../../entity/SavingDepot";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { SavingTransaction } from "../../../../entity/SavingTransaction";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";

@Resolver(SavingTransaction)
export class CreateSavingTransactionResolver {
  @Mutation(() => SavingTransaction)
  @UseMiddleware(isAuth)
  async createSavingTransaction(
    @Arg("describtion") describtion: string,
    @Arg("amount") amount: number,
    @Arg("depotId") depotId: string,
    @Arg("date", { nullable: true }) date: number,
    @Ctx() ctx: MyContext
  ): Promise<SavingTransaction> {
    const user = ctx.res.locals.user;
    console.log("______INSIDE HERE_______");

    const depot = await SavingDepot.findOne({ id: depotId, user });
    if (!depot) {
      throw new Error("Cannot find Depot!");
    }
    const newTransaction = new SavingTransaction();
    newTransaction.describtion = describtion;
    newTransaction.amount = amount;
    newTransaction.depot = depot;
    newTransaction.createdAt = date ? new Date(date) : new Date();
    newTransaction.user = user;

    await newTransaction.save();
    return newTransaction;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
