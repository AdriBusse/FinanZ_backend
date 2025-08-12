import { MyContext } from "../../../../types/MyContext";
import { SavingDepot } from "../../../../entity/SavingDepot";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(SavingDepot)
export class DeleteSavingDepotResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteSavingDepot(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = ctx.res.locals.user;
    const depot = await SavingDepot.findOneOrFail({ id, user });

    if (!depot) {
      throw new Error("Depot not found");
    }

    await depot.remove();
    return true;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
