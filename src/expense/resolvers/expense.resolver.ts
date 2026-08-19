import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "../entities/expense.entity";
import { ExpenseTransaction } from "../entities/expense-transaction.entity";
import { User } from "../../user/entities/user.entity";
import { ExpenseByCategory } from "../types/expense-by-category.type";
import { ExpenseService } from "../services/expense.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import {
  compareTransactionASC,
  compareTransactionDESC,
} from "../../common/utils/compare-transaction";

@Resolver(() => Expense)
export class ExpenseResolver {
  constructor(
    private readonly expenseService: ExpenseService,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseTransaction)
    private readonly transactionRepository: Repository<ExpenseTransaction>
  ) {}

  @Query(() => [Expense])
  @UseGuards(GqlAuthGuard)
  async getExpenses(
    @Args("archived", { nullable: true }) archived: boolean,
    @CurrentUser() user: User
  ): Promise<Expense[]> {
    return this.expenseService.getExpenses(archived, user);
  }

  @Query(() => Expense)
  @UseGuards(GqlAuthGuard)
  async getExpense(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<Expense> {
    return this.expenseService.getExpense(id, user);
  }

  @Mutation(() => Expense)
  @UseGuards(GqlAuthGuard)
  async createExpense(
    @Args("name") name: string,
    @Args("currency") currency: string,
    @CurrentUser() user: User
  ): Promise<Expense> {
    return this.expenseService.createExpense(name, currency, user);
  }

  @Mutation(() => Expense)
  @UseGuards(GqlAuthGuard)
  async updateExpense(
    @Args("id") id: string,
    @Args("name", { nullable: true }) name: string,
    @Args("currency", { nullable: true }) currency: string,
    @Args("isArchived", { nullable: true }) isArchived: boolean,
    @Args("spendingLimit", { nullable: true, type: () => Int }) spendingLimit: number,
    @CurrentUser() user: User
  ): Promise<Expense> {
    return this.expenseService.updateExpense(
      id,
      name,
      currency,
      isArchived,
      spendingLimit,
      user
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteExpense(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.expenseService.deleteExpense(id, user);
  }

  @ResolveField(() => [ExpenseTransaction], { nullable: true })
  async transactions(
    @Parent() expense: Expense,
    @Args("order", { defaultValue: "DESC" }) order: "DESC" | "ASC"
  ): Promise<ExpenseTransaction[]> {
    const expenseTransactions = await this.transactionRepository.find({
      where: { expense: { id: expense.id } },
      relations: ["category"],
    });

    if (order === "DESC") {
      return expenseTransactions.sort(compareTransactionDESC);
    }

    return expenseTransactions.sort(compareTransactionASC);
  }

  @ResolveField(() => User)
  async user(@Parent() expense: Expense): Promise<User> {
    const expenseRec = await this.expenseRepository.findOneOrFail({
      where: { id: expense.id },
      relations: ["user"],
    });
    return expenseRec.user;
  }

  @ResolveField(() => Number)
  async sum(@Parent() expense: Expense): Promise<number> {
    if (typeof expense.sum === "number") {
      return expense.sum;
    }

    const total = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("COALESCE(SUM(transaction.amount), 0)", "sum")
      .where("transaction.expenseId = :expenseId", { expenseId: expense.id })
      .getRawOne();

    return parseFloat(Number(total.sum).toFixed(2));
  }

  @ResolveField(() => Int)
  async transactionCount(@Parent() expense: Expense): Promise<number> {
    if (typeof expense.transactionCount === "number") {
      return expense.transactionCount;
    }

    const total = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("COUNT(transaction.id)", "count")
      .where("transaction.expenseId = :expenseId", { expenseId: expense.id })
      .getRawOne();

    return Number(total.count);
  }

  @ResolveField(() => [ExpenseByCategory])
  async expenseByCategory(
    @Parent() expense: Expense
  ): Promise<ExpenseByCategory[]> {
    const exp = await this.expenseRepository.findOneOrFail({
      where: { id: expense.id },
      relations: ["transactions", "transactions.category"],
    });

    const byCategory: any = {
      default: { amount: 0, color: "", icon: "" },
    };

    (exp.transactions || []).forEach((transaction) => {
      if (!transaction.category) {
        byCategory.default.amount += transaction.amount;
      } else {
        if (byCategory[transaction.category.name]) {
          byCategory[transaction.category.name].amount += transaction.amount;
        } else {
          byCategory[transaction.category.name] = {
            amount: transaction.amount,
            color: transaction.category.color || "",
            icon: transaction.category.icon || "",
          };
        }
      }
    });

    const byCategoryArray: ExpenseByCategory[] = [];
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
