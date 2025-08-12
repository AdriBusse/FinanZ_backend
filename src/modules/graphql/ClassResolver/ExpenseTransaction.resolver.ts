import { ExpenseCategory } from "../../../entity/ExpenseCategory";
import { User } from "../../../entity/User";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Expense } from "../../../entity/Expense";
import { ExpenseTransaction } from "../../../entity/ExpenseTransaction";

@Resolver(() => ExpenseTransaction)
export class ExpenseTransactionResolver
  implements ResolverInterface<ExpenseTransaction>
{
  @FieldResolver()
  async expense(
    @Root() expenseTransaction: ExpenseTransaction
  ): Promise<Expense> {
    const expense = await ExpenseTransaction.findOneOrFail(
      expenseTransaction.id,
      {
        relations: ["expense"],
      }
    );

    return expense.expense;
  }
  @FieldResolver()
  async user(@Root() expenseTransaction: ExpenseTransaction): Promise<User> {
    const expenseTrans = await ExpenseTransaction.findOneOrFail(
      expenseTransaction.id,
      {
        relations: ["user"],
      }
    );
    return expenseTrans.user;
  }
  @FieldResolver()
  async category(
    @Root() expenseTransaction: ExpenseTransaction
  ): Promise<ExpenseCategory> {
    const expenseTrans = await ExpenseTransaction.findOneOrFail(
      expenseTransaction.id,
      {
        relations: ["category"],
      }
    );

    return expenseTrans.category;
  }
}
