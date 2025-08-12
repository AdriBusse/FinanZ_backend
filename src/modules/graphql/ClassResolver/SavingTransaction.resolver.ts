import { User } from "../../../entity/User";
import { SavingTransaction } from "../../../entity/SavingTransaction";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { SavingDepot } from "../../../entity/SavingDepot";

@Resolver(() => SavingTransaction)
export class SavingTransactionResolver
  implements ResolverInterface<SavingTransaction>
{
  @FieldResolver()
  async depot(
    @Root() savingTransaction: SavingTransaction
  ): Promise<SavingDepot> {
    const depot = await SavingTransaction.findOneOrFail(savingTransaction.id, {
      relations: ["depot"],
    });

    return depot.depot;
  }
  @FieldResolver()
  async user(@Root() savingTransaction: SavingTransaction): Promise<User> {
    const depot = await SavingTransaction.findOneOrFail(savingTransaction.id, {
      relations: ["user"],
    });
    console.log("____________find user with id: ", depot.user.id);

    return depot.user;
  }
}
