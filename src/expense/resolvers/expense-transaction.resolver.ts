import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpenseTransaction } from "../entities/expense-transaction.entity";
import { Expense } from "../entities/expense.entity";
import { ExpenseCategory } from "../entities/expense-category.entity";
import { User } from "../../user/entities/user.entity";
import { ExpenseTransactionService } from "../services/expense-transaction.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Resolver(() => ExpenseTransaction)
export class ExpenseTransactionResolver {
  constructor(
    private readonly transactionService: ExpenseTransactionService,
    @InjectRepository(ExpenseTransaction)
    private readonly transactionRepository: Repository<ExpenseTransaction>
  ) {}

  @Mutation(() => ExpenseTransaction)
  @UseGuards(GqlAuthGuard)
  async createExpenseTransaction(
    @Args("amount") amount: number,
    @Args("describtion") describtion: string,
    @Args("expenseId") expenseId: string,
    @Args("date", { nullable: true }) date: Date,
    @Args("categoryId", { nullable: true }) categoryId: string,
    @CurrentUser() user: User
  ): Promise<ExpenseTransaction> {
    return this.transactionService.createExpenseTransaction(
      amount,
      date,
      describtion,
      expenseId,
      categoryId,
      user
    );
  }

  @Mutation(() => ExpenseTransaction)
  @UseGuards(GqlAuthGuard)
  async updateExpenseTransaction(
    @Args("id") id: string,
    @Args("amount", { nullable: true }) amount: number,
    @Args("date", { nullable: true }) date: Date,
    @Args("describtion", { nullable: true }) describtion: string,
    @Args("categoryId", { nullable: true }) categoryId: string,
    @Args("expenseId", { nullable: true }) expenseId: string,
    @CurrentUser() user: User
  ): Promise<ExpenseTransaction> {
    return this.transactionService.updateExpenseTransaction(
      id,
      amount,
      date,
      describtion,
      categoryId,
      expenseId,
      user
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteExpenseTransaction(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.transactionService.deleteExpenseTransaction(id, user);
  }

  @ResolveField(() => User)
  async user(@Parent() transaction: ExpenseTransaction): Promise<User> {
    const trans = await this.transactionRepository.findOneOrFail({
      where: { id: transaction.id },
      relations: ["user"],
    });
    return trans.user;
  }

  @ResolveField(() => Expense)
  async expense(@Parent() transaction: ExpenseTransaction): Promise<Expense> {
    const trans = await this.transactionRepository.findOneOrFail({
      where: { id: transaction.id },
      relations: ["expense"],
    });
    return trans.expense;
  }

  @ResolveField(() => ExpenseCategory, { nullable: true })
  async category(
    @Parent() transaction: ExpenseTransaction
  ): Promise<ExpenseCategory | null> {
    const trans = await this.transactionRepository.findOne({
      where: { id: transaction.id },
      relations: ["category"],
    });
    return trans?.category || null;
  }
}
