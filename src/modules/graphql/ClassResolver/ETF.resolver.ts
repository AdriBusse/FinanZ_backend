import { LemonAPI } from "./../../Services/LemonAPI";
import { ETFTransaction } from "../../../entity/ETFTransaction";
import { ETF } from "../../../entity/ETF";
import {
  Arg,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import {
  compareTransactionASC,
  compareTransactionDESC,
} from "../../../utils/compareTransaction";
import { User } from "src/entity/User";

@Resolver(() => ETF)
export class ETFResolver implements ResolverInterface<ETF> {
  @FieldResolver()
  async transactions(
    @Root() etf: ETF,
    @Arg("order", { defaultValue: "DESC" }) order: "DESC" | "ASC"
  ): Promise<ETFTransaction[]> {
    const etfTransactions = await ETFTransaction.find({
      where: { etf },
    });
    console.log(order);

    if (order === "DESC") {
      return etfTransactions.sort(compareTransactionDESC);
    }
    return etfTransactions.sort(compareTransactionASC);
  }
  @FieldResolver()
  async user(@Root() etf: ETF): Promise<User> {
    const etfRec = await ETF.findOneOrFail({
      where: { id: etf.id },
      relations: ["user"],
    });

    return etfRec.user;
  }

  @FieldResolver()
  async deposited(@Root() etf: ETF): Promise<number> {
    let sum = 0;

    const deposits = await ETFTransaction.find({
      where: { etf },
    });

    deposits.forEach((dep) => {
      sum += dep.invest;
      sum += dep.fee;
    });

    return sum;
  }

  @FieldResolver()
  async worth(@Root() etf: ETF): Promise<number> {
    const transaction = await ETFTransaction.find({
      where: { etf },
    });

    const amount = transaction.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

    const worth = await LemonAPI.getETFWorth(etf.isin, amount);

    return worth;
  }

  @FieldResolver()
  async amount(@Root() etf: ETF): Promise<number> {
    const transaction = await ETFTransaction.find({
      where: { etf },
    });

    const amount = transaction.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

    return parseFloat(amount.toFixed(2));
  }
}
