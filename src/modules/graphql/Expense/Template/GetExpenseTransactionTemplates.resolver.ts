import { ExpenseTransactionTemplate } from "../../../../entity/ExpenseTransactionTemplate";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";

@Resolver(ExpenseTransactionTemplate)
export class GetExpenseTransactionTemplatesResolver {
  @Query(() => [ExpenseTransactionTemplate])
  @UseMiddleware(isAuth)
  async getExpenseTransactionTemplates(@Ctx() ctx: MyContext): Promise<ExpenseTransactionTemplate[]> {
    const user = ctx.res.locals.user;
    return ExpenseTransactionTemplate.find({ user });
  }
}

@Resolver(ExpenseTransactionTemplate)
export class GetExpenseTransactionTemplateResolver {
  @Query(() => ExpenseTransactionTemplate)
  @UseMiddleware(isAuth)
  async getExpenseTransactionTemplate(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<ExpenseTransactionTemplate> {
    const user = ctx.res.locals.user;
    const template = await ExpenseTransactionTemplate.findOne({ id, user });
    if (!template) throw new Error("Cannot find template!");
    return template;
  }
}
