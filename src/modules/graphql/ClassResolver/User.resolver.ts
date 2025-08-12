import { ExpenseCategory } from "../../../entity/ExpenseCategory";
import { ExpenseTransaction } from "../../../entity/ExpenseTransaction";
import { Expense } from "../../../entity/Expense";
import { ETFTransaction } from "../../../entity/ETFTransaction";
import { SavingTransaction } from "../../../entity/SavingTransaction";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { SavingDepot } from "../../../entity/SavingDepot";
import { User } from "../../../entity/User";
import { ETF } from "../../../entity/ETF";

@Resolver(() => User)
export class UserResolver implements ResolverInterface<User> {
  @FieldResolver()
  async etfs(@Root() user: User): Promise<ETF[]> {
    const etfs = await User.findOneOrFail(user.id, {
      relations: ["etfs"],
    });

    return etfs.etfs;
  }

  @FieldResolver()
  async etfTransactions(@Root() user: User): Promise<ETFTransaction[]> {
    const userRec = await User.findOneOrFail(user.id, {
      relations: ["etfTransactions"],
    });

    return userRec.etfTransactions;
  }
  @FieldResolver()
  async savingDepots(@Root() user: User): Promise<SavingDepot[]> {
    const userRec = await User.findOneOrFail(user.id, {
      relations: ["savingDepots"],
    });

    return userRec.savingDepots;
  }
  @FieldResolver()
  async savingTransactions(@Root() user: User): Promise<SavingTransaction[]> {
    const userRec = await User.findOneOrFail(user.id, {
      relations: ["savingTransactions"],
    });

    return userRec.savingTransactions;
  }

  @FieldResolver()
  async expenseDepots(@Root() user: User): Promise<Expense[]> {
    const userRec = await User.findOneOrFail(user.id, {
      relations: ["expenseDepots"],
    });

    return userRec.expenseDepots;
  }
  @FieldResolver()
  async expenseTransactions(@Root() user: User): Promise<ExpenseTransaction[]> {
    const userRec = await User.findOneOrFail(user.id, {
      relations: ["expenseTransactions"],
    });

    return userRec.expenseTransactions;
  }

  @FieldResolver()
  async expenseCategory(@Root() user: User): Promise<ExpenseCategory[]> {
    const userRec = await User.findOneOrFail(user.id, {
      relations: ["expenseCategory"],
    });

    return userRec.expenseCategory;
  }
}
