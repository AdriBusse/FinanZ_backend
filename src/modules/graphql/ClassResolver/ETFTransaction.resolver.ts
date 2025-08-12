import { User } from "../../../entity/User";
import { ETFTransaction } from "../../../entity/ETFTransaction";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { ETF } from "../../../entity/ETF";

@Resolver(() => ETFTransaction)
export class ETFTransactionResolver
  implements ResolverInterface<ETFTransaction>
{
  @FieldResolver()
  async etf(@Root() etfTransaction: ETFTransaction): Promise<ETF> {
    const etf = await ETFTransaction.findOneOrFail(
      { id: etfTransaction.id },
      { relations: ["etf"] }
    );

    return etf.etf;
  }

  @FieldResolver()
  async user(@Root() etfTransaction: ETFTransaction): Promise<User> {
    const etf = await ETFTransaction.findOneOrFail(
      { id: etfTransaction.id },
      { relations: ["user"] }
    );

    return etf.user;
  }
}
