import { ExpenseCategory } from "../../../entity/ExpenseCategory";
import { User } from "../../../entity/User";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { ExpenseTransaction } from "../../../entity/ExpenseTransaction";

@Resolver(() => ExpenseCategory)
export class ExpenseCategoryResolver
  implements ResolverInterface<ExpenseCategory>
{
  @FieldResolver()
  async user(@Root() expenseCategory: ExpenseCategory): Promise<User> {
    const expenseCat = await ExpenseCategory.findOneOrFail(expenseCategory.id, {
      relations: ["user"],
    });
    return expenseCat.user;
  }

  @FieldResolver()
  async transactions(
    @Root() expenseCategory: ExpenseCategory
  ): Promise<ExpenseTransaction[]> {
    const expenseTrans = await ExpenseTransaction.find({
      where: { category: expenseCategory },
    });

    return expenseTrans;
  }
}
