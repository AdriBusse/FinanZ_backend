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
    let sum = 0;

    const savingTransactions = await SavingTransaction.find({
      where: { depot: savingDepot },
    });

    savingTransactions.forEach((savingTransaction) => {
      sum += savingTransaction.amount;
    });

    return parseFloat(sum.toFixed(2));
  }
}
