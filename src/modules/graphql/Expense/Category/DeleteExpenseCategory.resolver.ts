import { ExpenseCategory } from "../../../../entity/ExpenseCategory";
import { Expense } from "../../../../entity/Expense";
import { MyContext } from "../../../../types/MyContext";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(Expense)
export class DeleteExpenseCategoryResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteExpenseCategory(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = ctx.res.locals.user;
    const expenseCategory = await ExpenseCategory.findOneOrFail({ id, user });

    if (!expenseCategory) {
      throw new Error("Expense Category not found");
    }

    await expenseCategory.softRemove();
    return true;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
