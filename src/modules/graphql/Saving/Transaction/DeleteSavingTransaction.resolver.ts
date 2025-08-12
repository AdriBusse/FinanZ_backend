import { MyContext } from "../../../../types/MyContext";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { SavingTransaction } from "../../../../entity/SavingTransaction";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(SavingTransaction)
export class DeleteSavingTransactionResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteSavingTransaction(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = ctx.res.locals.user;
    const transaction = await SavingTransaction.findOne({ id, user });
    if (!transaction) {
      throw new Error("Cannot find Transaction!");
    }

    await transaction.remove();
    return true;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
