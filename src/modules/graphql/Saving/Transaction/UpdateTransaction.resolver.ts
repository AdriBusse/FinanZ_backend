import { isAuth } from "../../../middleware/isAuth";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { SavingTransaction } from "../../../../entity/SavingTransaction";
import { MyContext } from "src/types/MyContext";

@Resolver(SavingTransaction)
export class UpdateSavingTransactionResolver {
  @Mutation(() => SavingTransaction)
  @UseMiddleware(isAuth)
  async updateSavingTransaction(
    @Arg("transactionId", { nullable: false }) transactionId: number,
    @Arg("describtion", { nullable: true }) describtion: string,
    @Arg("amount", { nullable: true }) amount: number,
    @Arg("date", { nullable: true }) date: string,
    @Ctx() ctx: MyContext
  ): Promise<SavingTransaction> {
    const user = ctx.res.locals.user;
    const transaction = await SavingTransaction.findOne({
      id: transactionId,
      user,
    });
    if (!transaction) {
      throw new Error("Cannot find Transaction!");
    }
    if (describtion) {
      transaction.describtion = describtion;
    }
    if (amount) {
      transaction.amount = amount;
    }
    if (date) {
      transaction.createdAt = new Date(date);
    }

    await transaction.save();
    return transaction;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
