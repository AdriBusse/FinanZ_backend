import { Expense } from "./../../../../entity/Expense";
import { isAuth } from "../../../middleware/isAuth";
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../../../types/MyContext";

@Resolver(Expense)
export class UpdateExpenseResolver {
  @Mutation(() => Expense)
  @UseMiddleware(isAuth)
  async updateExpense(
    @Arg("id", { nullable: false }) id: string,
    @Arg("title", { nullable: true }) title: string,
    @Arg("currency", { nullable: true }) currency: string,
    @Arg("archived", { nullable: true }) archived: boolean,
    @Arg("monthlyRecurring", { nullable: true }) monthlyRecurring: boolean,
    @Arg("spendingLimit", () => Int, { nullable: true }) spendingLimit: number | null,
    @Ctx() ctx: MyContext
  ): Promise<Expense> {
    const user = ctx.res.locals.user;
    const expense = await Expense.findOne({
      id,
      user,
    });
    if (!expense) {
      throw new Error("Cannot find Expense!");
    }
    if (title) {
      expense.title = title;
    }
    if (currency) {
      expense.currency = currency;
    }
    if (archived) {
      expense.archived = archived;
    }
    if (monthlyRecurring !== undefined) {
      expense.monthlyRecurring = monthlyRecurring;
    }
    if (spendingLimit !== undefined) {
      expense.spendingLimit = spendingLimit;
    }

    await expense.save();
    return expense;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
