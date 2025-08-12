import { ExpenseTransactionTemplate } from "../../../../entity/ExpenseTransactionTemplate";
import { ExpenseCategory } from "../../../../entity/ExpenseCategory";
import { Arg, Ctx, Float, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";

@Resolver(ExpenseTransactionTemplate)
export class CreateExpenseTransactionTemplateResolver {
  @Mutation(() => ExpenseTransactionTemplate)
  @UseMiddleware(isAuth)
  async createExpenseTransactionTemplate(
    @Arg("describtion") describtion: string,
    @Arg("amount", () => Float) amount: number,
    @Arg("categoryId", { nullable: true }) categoryId: string,
    @Ctx() ctx: MyContext
  ): Promise<ExpenseTransactionTemplate> {
    const user = ctx.res.locals.user;

    const template = new ExpenseTransactionTemplate();
    template.describtion = describtion;
    template.amount = amount;
    template.user = user;

    if (categoryId) {
      const cat = await ExpenseCategory.findOne({ id: categoryId, user });
      if (cat) template.category = cat;
    }

    await template.save();
    return template;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
