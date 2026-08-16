import { Expense } from "../../../entity/Expense";
import {
  Arg,
  FieldResolver,
  Int,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import {
  compareTransactionASC,
  compareTransactionDESC,
} from "../../../utils/compareTransaction";
import { User } from "../../../entity/User";
import { ExpenseTransaction } from "../../../entity/ExpenseTransaction";
import ExpenseByCategory from "src/entity/gql/ExpenseByCategory";

@Resolver(() => Expense)
export class ExpenseResolver implements ResolverInterface<Expense> {
  @FieldResolver()
  async transactions(
    @Root() expense: Expense,
    @Arg("order", { defaultValue: "DESC" }) order: "DESC" | "ASC"
  ): Promise<ExpenseTransaction[]> {
    const expenseTransactions = await ExpenseTransaction.find({
      where: { expense },
    });

    if (order === "DESC") {
      return expenseTransactions.sort(compareTransactionDESC);
    }

    return expenseTransactions.sort(compareTransactionASC);
  }
  @FieldResolver()
  async user(@Root() expense: Expense): Promise<User> {
    const expenseRec = await Expense.findOneOrFail(
      { id: expense.id },
      { relations: ["user"] }
    );

    return expenseRec.user;
  }

  @FieldResolver()
  async sum(@Root() expense: Expense): Promise<number> {
    if (typeof expense.sum === "number") {
      return expense.sum;
    }

    const total = await ExpenseTransaction.createQueryBuilder("transaction")
      .select("COALESCE(SUM(transaction.amount), 0)", "sum")
      .where("transaction.expenseId = :expenseId", { expenseId: expense.id })
      .getRawOne();

    return parseFloat(Number(total.sum).toFixed(2));
  }

  @FieldResolver(() => Int)
  async transactionCount(@Root() expense: Expense): Promise<number> {
    if (typeof expense.transactionCount === "number") {
      return expense.transactionCount;
    }

    const total = await ExpenseTransaction.createQueryBuilder("transaction")
      .select("COUNT(transaction.id)", "count")
      .where("transaction.expenseId = :expenseId", { expenseId: expense.id })
      .getRawOne();

    return Number(total.count);
  }

  @FieldResolver()
  async expenseByCategory(
    @Root() expense: Expense
  ): Promise<ExpenseByCategory[]> {
    const exp = await Expense.findOneOrFail(expense.id, {
      relations: ["transactions", "transactions.category"],
    });

    let byCategory: any = {
      default: { amount: 0, color: "", icon: "" },
    };

    exp.transactions.forEach((transaction) => {
      if (transaction.category === null) {
        //Wenn keine Kategorie vorhanden ist, dann zu Default
        byCategory.default.amount += transaction.amount;
      } else {
        if (byCategory[transaction.category.name]) {
          // wenn es den eintrag schon gibt dann zu den einträgen hinzufügen
          byCategory[transaction.category.name].amount += transaction.amount;
        } else {
          // wenn es den eintrag noch nicht gibt dann eintrag erstellen
          byCategory[transaction.category.name] = {
            amount: transaction.amount,
            color: transaction.category.color || "",
            icon: transaction.category.icon || "",
          };
        }
      }
    });

    let byCategoryArray: ExpenseByCategory[] = [];
    Object.keys(byCategory).forEach((key) => {
      byCategoryArray.push({
        name: key,
        amount: byCategory[key].amount,
        icon: byCategory[key].icon,
        color: byCategory[key].color,
      });
    });
    return byCategoryArray;
  }
}
