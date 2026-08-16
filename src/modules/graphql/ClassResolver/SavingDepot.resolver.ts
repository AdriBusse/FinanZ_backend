import { SavingTransaction } from "../../../entity/SavingTransaction";
import {
  Arg,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { SavingDepot } from "../../../entity/SavingDepot";
import {
  compareTransactionASC,
  compareTransactionDESC,
} from "../../../utils/compareTransaction";
import { User } from "../../../entity/User";

@Resolver(() => SavingDepot)
export class SavingDepotResolver implements ResolverInterface<SavingDepot> {
  @FieldResolver()
  async transactions(
    @Root() savingDepot: SavingDepot,
    @Arg("order", { defaultValue: "DESC" }) order: "DESC" | "ASC"
  ): Promise<SavingTransaction[]> {
    const savingTransactions = await SavingTransaction.find({
      where: { depot: savingDepot },
    });

    if (order === "DESC") {
      return savingTransactions.sort(compareTransactionDESC);
    }

    return savingTransactions.sort(compareTransactionASC);
  }
  @FieldResolver()
  async user(@Root() savingDepot: SavingDepot): Promise<User> {
    const savingDepotRec = await SavingDepot.findOneOrFail(
      { id: savingDepot.id },
      { relations: ["user"] }
    );

    return savingDepotRec.user;
  }

  @FieldResolver()
  async sum(@Root() savingDepot: SavingDepot): Promise<number> {
    if (typeof savingDepot.sum === "number") {
      return savingDepot.sum;
    }

    const total = await SavingTransaction.createQueryBuilder("transaction")
      .select("COALESCE(SUM(transaction.amount), 0)", "sum")
      .where("transaction.depotId = :depotId", { depotId: savingDepot.id })
      .getRawOne();

    return parseFloat(Number(total.sum).toFixed(2));
  }
}
