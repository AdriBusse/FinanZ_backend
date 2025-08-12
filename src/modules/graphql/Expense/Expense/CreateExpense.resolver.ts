import { Expense } from "../../../../entity/Expense";
import { ExpenseTransactionTemplate } from "../../../../entity/ExpenseTransactionTemplate";
import { ExpenseTransaction } from "../../../../entity/ExpenseTransaction";
import { Arg, Ctx, ID, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";

@Resolver(Expense)
export class CreateExpenseResolver {
  @Mutation(() => Expense)
  @UseMiddleware(isAuth)
  async createExpense(
    @Arg("title") title: string,
    @Arg("currency", { nullable: true }) currency: string,
    @Arg("monthlyRecurring", { nullable: true }) monthlyRecurring: boolean,
    @Arg("spendingLimit", () => Int, { nullable: true }) spendingLimit: number | null,
    @Arg("skipTemplateIds", () => [ID], { nullable: true }) skipTemplateIds: string[],
    @Ctx() ctx: MyContext
  ): Promise<Expense> {
    const user = ctx.res.locals.user;

    const expense = new Expense();
    expense.title = title;
    expense.currency = currency;
    if (monthlyRecurring !== undefined) {
      expense.monthlyRecurring = monthlyRecurring;
    }
    if (spendingLimit !== undefined) {
      expense.spendingLimit = spendingLimit;
    }
    expense.user = user;

    await expense.save();

    // If recurring, auto-create transactions from user templates, skipping provided IDs
    if (expense.monthlyRecurring) {
      const templates = await ExpenseTransactionTemplate.find({
        where: { user },
        relations: ["category"],
      } as any);
      const skip = new Set((skipTemplateIds || []).map((id) => String(id)));
      const toCreate = templates.filter((t) => !skip.has(String(t.id)));

      for (const tpl of toCreate) {
        const tx = new ExpenseTransaction();
        tx.describtion = tpl.describtion;
        tx.amount = tpl.amount;
        if (tpl.category) tx.category = tpl.category;
        tx.user = user;
        tx.expense = expense;
        await tx.save();
      }
    }
    return expense;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
