import { ExpenseCategory } from "../../../../entity/ExpenseCategory";
import { ExpenseTransaction } from "../../../../entity/ExpenseTransaction";
import { isAuth } from "../../../middleware/isAuth";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../../../types/MyContext";

@Resolver(ExpenseTransaction)
export class UpdateExpenseTransactionResolver {
  @Mutation(() => ExpenseTransaction)
  @UseMiddleware(isAuth)
  async updateExpenseTransaction(
    @Arg("transactionId", { nullable: false }) transactionId: string,
    @Arg("describtion", { nullable: true }) describtion: string,
    @Arg("categoryId", { nullable: true }) categoryId: string,
    @Arg("amount", { nullable: true }) amount: number,
    @Arg("date", { nullable: true }) date: string,
    @Ctx() ctx: MyContext
  ): Promise<ExpenseTransaction> {
    const user = ctx.res.locals.user;
    const transaction = await ExpenseTransaction.findOne({
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
    if (categoryId) {
      const cat = await ExpenseCategory.findOneOrFail(categoryId);
      transaction.category = cat;
    }

    await transaction.save();
    return transaction;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
