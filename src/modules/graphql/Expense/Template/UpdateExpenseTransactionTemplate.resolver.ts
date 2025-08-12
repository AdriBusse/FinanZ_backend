import { ExpenseTransactionTemplate } from "../../../../entity/ExpenseTransactionTemplate";
import { ExpenseCategory } from "../../../../entity/ExpenseCategory";
import { Arg, Ctx, Float, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";

@Resolver(ExpenseTransactionTemplate)
export class UpdateExpenseTransactionTemplateResolver {
  @Mutation(() => ExpenseTransactionTemplate)
  @UseMiddleware(isAuth)
  async updateExpenseTransactionTemplate(
    @Arg("id") id: string,
    @Arg("describtion", { nullable: true }) describtion: string,
    @Arg("amount", () => Float, { nullable: true }) amount: number,
    @Arg("categoryId", { nullable: true }) categoryId: string,
    @Ctx() ctx: MyContext
  ): Promise<ExpenseTransactionTemplate> {
    const user = ctx.res.locals.user;

    const template = await ExpenseTransactionTemplate.findOne({ id, user });
    if (!template) throw new Error("Cannot find template!");

    if (describtion) template.describtion = describtion;
    if (amount !== undefined) template.amount = amount;
    if (categoryId !== undefined) {
      if (!categoryId) {
        // empty string clears category
        template.category = null as any;
      } else {
        const cat = await ExpenseCategory.findOne({ id: categoryId, user });
        if (cat) template.category = cat;
      }
    }

    await template.save();
    return template;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
