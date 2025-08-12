import { ExpenseCategory } from "../../../../entity/ExpenseCategory";
import { MyContext } from "../../../../types/MyContext";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(ExpenseCategory)
export class GetExpenseCategoriesResolver {
  @Query(() => [ExpenseCategory], { nullable: true })
  @UseMiddleware(isAuth)
  async getExpenseCategories(
    @Ctx() ctx: MyContext
  ): Promise<ExpenseCategory[]> {
    const user = ctx.res.locals.user;
    const expenseCat = await ExpenseCategory.find({ user });
    console.log(expenseCat);

    return expenseCat;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
