import { MyContext } from "../../../../types/MyContext";
import { SavingDepot } from "../../../../entity/SavingDepot";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver(SavingDepot)
export class GetSavingDepotResolver {
  @Query(() => SavingDepot, { nullable: true })
  @UseMiddleware(isAuth)
  async getSavingDepot(
    @Arg("id") id: string,
    @Ctx() ctx: MyContext
  ): Promise<SavingDepot> {
    const user = ctx.res.locals.user;
    const depot = await SavingDepot.findOneOrFail({ id, user });
    return depot;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
