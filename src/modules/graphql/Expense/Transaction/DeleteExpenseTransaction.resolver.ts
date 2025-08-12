import { ExpenseTransaction } from "../../../../entity/ExpenseTransaction";
import { MyContext } from "../../../../types/MyContext";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(ExpenseTransaction)
export class DeleteExpenseTransactionResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteExpenseTransaction(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = ctx.res.locals.user;
    const transaction = await ExpenseTransaction.findOne({ id, user });
    if (!transaction) {
      throw new Error("Cannot find Transaction!");
    }

    await transaction.remove();
    return true;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
