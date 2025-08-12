import { SavingDepot } from "./../../../../entity/SavingDepot";
import { isAuth } from "../../../middleware/isAuth";
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../../../types/MyContext";

@Resolver(SavingDepot)
export class UpdateSavingDepotResolver {
  @Mutation(() => SavingDepot)
  @UseMiddleware(isAuth)
  async updateSavingDepot(
    @Arg("id", { nullable: false }) id: string,
    @Arg("name", { nullable: true }) name: string,
    @Arg("short", { nullable: true }) short: string,
    @Arg("currency", { nullable: true }) currency: string,
    @Arg("savinggoal", () => Int, { nullable: true }) savinggoal: number | null,
    @Ctx() ctx: MyContext
  ): Promise<SavingDepot> {
    const user = ctx.res.locals.user;
    const savingDepot = await SavingDepot.findOne({
      id,
      user,
    });
    if (!savingDepot) {
      throw new Error("Cannot find Saving Depot!");
    }
    if (name) {
      savingDepot.name = name;
    }
    if (short) {
      savingDepot.short = short;
    }
    if (currency) {
      savingDepot.currency = currency;
    }
    if (savinggoal !== undefined) {
      // allow explicit null to unset
      savingDepot.savinggoal = savinggoal;
    }

    await savingDepot.save();
    return savingDepot;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
