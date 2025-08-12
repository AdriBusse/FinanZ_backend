import { isAuth } from "../../../middleware/isAuth";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../../../types/MyContext";
import { ExpenseCategory } from "../../../../entity/ExpenseCategory";

@Resolver(ExpenseCategory)
export class UpdateExpenseCategoryResolver {
  @Mutation(() => ExpenseCategory)
  @UseMiddleware(isAuth)
  async updateExpenseCategory(
    @Arg("id", { nullable: false }) id: string,
    @Arg("name", { nullable: true }) name: string,
    @Arg("icon", { nullable: true }) icon: string,
    @Arg("color", { nullable: true }) color: string,
    @Ctx() ctx: MyContext
  ): Promise<ExpenseCategory> {
    const user = ctx.res.locals.user;
    const cat = await ExpenseCategory.findOne({
      id,
      user,
    });
    if (!cat) {
      throw new Error("Cannot find Category!");
    }
    if (name) {
      cat.name = name;
    }
    if (color) {
      cat.color = color;
    }
    if (icon) {
      cat.icon = icon;
    }

    await cat.save();
    return cat;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
