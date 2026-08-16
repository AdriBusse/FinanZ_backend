import { MyContext } from "../../../../types/MyContext";
import { SavingDepot } from "../../../../entity/SavingDepot";
import { SavingTransaction } from "../../../../entity/SavingTransaction";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";

@Resolver()
export class GetSavingDepotsResolver {
  @Query(() => [SavingDepot])
  @UseMiddleware(isAuth)
  async getSavingDepots(@Ctx() ctx: MyContext): Promise<SavingDepot[]> {
    const user = ctx.res.locals.user;
    const depots = await SavingDepot.find({ user });
    if (depots.length === 0) return depots;

    const totals = await SavingTransaction.createQueryBuilder("transaction")
      .select("transaction.depotId", "depotId")
      .addSelect("COALESCE(SUM(transaction.amount), 0)", "sum")
      .where("transaction.depotId IN (:...depotIds)", {
        depotIds: depots.map((depot) => depot.id),
      })
      .groupBy("transaction.depotId")
      .getRawMany();
    const sumsByDepotId = new Map(
      totals.map((total) => [String(total.depotId), Number(total.sum)])
    );

    return depots.map((depot) => {
      depot.sum = sumsByDepotId.get(String(depot.id)) || 0;
      return depot;
    });
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
