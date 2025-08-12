import { Expense } from "../../../../entity/Expense";
import { MyContext } from "../../../../types/MyContext";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(Expense)
export class GetExpenseResolver {
  @Query(() => Expense, { nullable: true })
  @UseMiddleware(isAuth)
  async getExpense(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<Expense> {
    const user = ctx.res.locals.user;
    const expense = await Expense.findOneOrFail({ id, user });
    return expense;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
    console.log("________________Backend error_______________");
  }
}
