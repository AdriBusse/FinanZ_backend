import { ExpenseTransactionTemplate } from "../../../../entity/ExpenseTransactionTemplate";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";

@Resolver(ExpenseTransactionTemplate)
export class DeleteExpenseTransactionTemplateResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteExpenseTransactionTemplate(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = ctx.res.locals.user;
    const template = await ExpenseTransactionTemplate.findOne({ id, user });
    if (!template) throw new Error("Cannot find template!");

    await template.remove();
    return true;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
