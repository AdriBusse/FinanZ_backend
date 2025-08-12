import { ExpenseCategory } from "../../../../entity/ExpenseCategory";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";

@Resolver(ExpenseCategory)
export class CreateExpenseCategoryResolver {
  @Mutation(() => ExpenseCategory)
  @UseMiddleware(isAuth)
  async createExpenseCategory(
    @Arg("name") name: string,
    @Arg("color", { nullable: true }) color: string,
    @Arg("icon", { nullable: true }) icon: string,
    @Ctx() ctx: MyContext
  ): Promise<ExpenseCategory | null> {
    const user = ctx.res.locals.user;

    const duplicate = await ExpenseCategory.findOne({ name, user });
    if (duplicate) {
      throw new Error("Category already exists!");
      return null;
    }
    const expenseCat = new ExpenseCategory();
    expenseCat.name = name;
    expenseCat.color = color;
    expenseCat.icon = icon;
    expenseCat.user = user;

    await expenseCat.save();
    return expenseCat;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
