import { MyContext } from "../../../../types/MyContext";
import { SavingDepot } from "../../../../entity/SavingDepot";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver()
export class GetSavingDepotsResolver {
  @Query(() => [SavingDepot])
  @UseMiddleware(isAuth)
  async getSavingDepots(@Ctx() ctx: MyContext): Promise<SavingDepot[]> {
    const user = ctx.res.locals.user;
    const depots = await SavingDepot.find({ user });
    return depots;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
