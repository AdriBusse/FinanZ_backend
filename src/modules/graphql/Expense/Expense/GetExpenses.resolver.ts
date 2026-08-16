import { Expense } from "../../../../entity/Expense";
import { ExpenseTransaction } from "../../../../entity/ExpenseTransaction";
import { MyContext } from "../../../../types/MyContext";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver()
export class GetExpensesResolver {
  @Query(() => [Expense])
  @UseMiddleware(isAuth)
  async getExpenses(
    @Ctx() ctx: MyContext,
    @Arg("order", { defaultValue: "DESC" }) orderType: "ASC" | "DESC",
    @Arg("archived", { nullable: true }) archived: boolean
  ): Promise<Expense[]> {
    const user = ctx.res.locals.user;
    const order = orderType ? { ["createdAt"]: orderType } : {};
    console.log("________", archived);

    const expenses = await Expense.find({
      where: archived !== undefined ? { user, archived } : { user },
      order,
    });

    if (expenses.length === 0) return expenses;

    const totals = await ExpenseTransaction.createQueryBuilder("transaction")
      .select("transaction.expenseId", "expenseId")
      .addSelect("COALESCE(SUM(transaction.amount), 0)", "sum")
      .addSelect("COUNT(transaction.id)", "transactionCount")
      .where("transaction.expenseId IN (:...expenseIds)", {
        expenseIds: expenses.map((expense) => expense.id),
      })
      .groupBy("transaction.expenseId")
      .getRawMany();
    const sumsByExpenseId = new Map(
      totals.map((total) => [
        String(total.expenseId),
        {
          sum: Number(total.sum),
          transactionCount: Number(total.transactionCount),
        },
      ])
    );

    return expenses.map((expense) => {
      const totals = sumsByExpenseId.get(String(expense.id));
      expense.sum = totals?.sum || 0;
      expense.transactionCount = totals?.transactionCount || 0;
      return expense;
    });
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
