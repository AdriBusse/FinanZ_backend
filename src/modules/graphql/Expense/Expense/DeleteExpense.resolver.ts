import { Expense } from "../../../../entity/Expense";
import { MyContext } from "../../../../types/MyContext";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(Expense)
export class DeleteExpenseResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteExpense(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = ctx.res.locals.user;
    const expense = await Expense.findOneOrFail({ id, user });

    if (!expense) {
      throw new Error("Expense not found");
    }

    await expense.softRemove();
    return true;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
