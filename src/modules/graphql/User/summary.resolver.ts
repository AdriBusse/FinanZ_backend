import { LemonAPI } from "./../../Services/LemonAPI";
import { SavingDepot } from "../../../entity/SavingDepot";
import { ExpenseTransaction } from "../../../entity/ExpenseTransaction";
import UserSummary from "../../../entity/gql/UserSummary";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../../types/MyContext";
import { Expense } from "../../../entity/Expense";
import { ETF } from "../../../entity/ETF";
import { Between } from "typeorm";

@Resolver(UserSummary)
export class Summary {
  @Query(() => UserSummary)
  @UseMiddleware(isAuth)
  async summary(@Ctx() ctx: MyContext) {
    const user = ctx.res.locals.user;
    try {
      const latestExpense = await Expense.findOne({
        where: { user: user },
        order: { createdAt: "DESC" },
      });

      const etfs = await ETF.find({
        where: { user: user },
        relations: ["transactions"],
      });
      let etfInvested = 0;

      etfs.forEach((etf) => {
        etf.transactions.forEach((transaction) => {
          etfInvested += transaction.invest;
          etfInvested += transaction.fee;
        });
      });

      let etfWorth = 0;

      for (const etf of etfs) {
        let etfAmount = etf.transactions.reduce((acc, transaction) => {
          return acc + transaction.amount;
        }, 0);

        const res = await LemonAPI.getETFWorth(etf.isin, etfAmount);
        etfWorth += res;
      }

      let percentMovement = 0;
      if (etfInvested !== 0 && etfWorth !== 0) {
        percentMovement = parseFloat(
          ((etfWorth * 100) / etfInvested - 100).toFixed(2)
        );
      }

      const todayExpenses = await ExpenseTransaction.find({
        where: {
          createdAt: Between(
            new Date(new Date().setDate(new Date().getDate() - 1)),
            new Date()
          ),
        },
      });

      const savings = await SavingDepot.find({
        where: { user: user },
        relations: ["transactions"],
      });
      let totalSaving = 0;
      savings.forEach((saving) => {
        saving.transactions.forEach((transaction) => {
          totalSaving += transaction.amount;
        });
      });

      const summary = new UserSummary();
      summary.latestExpense = latestExpense || null;
      summary.todaySpent = todayExpenses;
      summary.etfWorth = parseFloat(etfWorth.toFixed(2));
      summary.etfMovement = percentMovement;
      summary.savingValue = totalSaving;

      return summary;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
