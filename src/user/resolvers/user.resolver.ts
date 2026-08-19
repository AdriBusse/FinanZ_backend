import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserService } from "../user.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AuthProvider } from "../../auth/types/auth-provider.enum";
import { ETF } from "../../etf/entities/etf.entity";
import { ETFTransaction } from "../../etf/entities/etf-transaction.entity";
import { SavingDepot } from "../../saving/entities/saving-depot.entity";
import { SavingTransaction } from "../../saving/entities/saving-transaction.entity";
import { Expense } from "../../expense/entities/expense.entity";
import { ExpenseTransaction } from "../../expense/entities/expense-transaction.entity";
import { ExpenseCategory } from "../../expense/entities/expense-category.entity";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ETF)
    private readonly etfRepository: Repository<ETF>,
    @InjectRepository(ETFTransaction)
    private readonly etfTransactionRepository: Repository<ETFTransaction>,
    @InjectRepository(SavingDepot)
    private readonly savingDepotRepository: Repository<SavingDepot>,
    @InjectRepository(SavingTransaction)
    private readonly savingTransactionRepository: Repository<SavingTransaction>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseTransaction)
    private readonly expenseTransactionRepository: Repository<ExpenseTransaction>,
    @InjectRepository(ExpenseCategory)
    private readonly expenseCategoryRepository: Repository<ExpenseCategory>
  ) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async getUser(@Args("username") username: string): Promise<User> {
    return this.userService.getUser(username);
  }

  @Query(() => User, { nullable: true })
  async me(@CurrentUser() user?: User): Promise<User | null> {
    if (!user) {
      return null;
    }
    return user;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args("currentPassword") currentPassword: string,
    @Args("newPassword") newPassword: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.userService.changePassword(currentPassword, newPassword, user);
  }

  @ResolveField(() => [AuthProvider])
  async linkedProviders(@Parent() user: User): Promise<AuthProvider[]> {
    const userRecord = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ["identities"],
    });
    return (userRecord?.identities || []).map((identity) => identity.provider);
  }

  @ResolveField(() => Boolean)
  hasPassword(@Parent() user: User): boolean {
    return Boolean(user.password);
  }

  @ResolveField(() => [ETF])
  async etfs(@Parent() user: User): Promise<ETF[]> {
    return this.etfRepository.find({
      where: { user: { id: user.id } },
    });
  }

  @ResolveField(() => [ETFTransaction])
  async etfTransactions(@Parent() user: User): Promise<ETFTransaction[]> {
    return this.etfTransactionRepository.find({
      where: { user: { id: user.id } },
    });
  }

  @ResolveField(() => [SavingDepot])
  async savingDepots(@Parent() user: User): Promise<SavingDepot[]> {
    return this.savingDepotRepository.find({
      where: { user: { id: user.id } },
    });
  }

  @ResolveField(() => [SavingTransaction])
  async savingTransactions(@Parent() user: User): Promise<SavingTransaction[]> {
    return this.savingTransactionRepository.find({
      where: { user: { id: user.id } },
    });
  }

  @ResolveField(() => [Expense])
  async expenseDepots(@Parent() user: User): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { id: user.id } },
    });
  }

  @ResolveField(() => [ExpenseTransaction])
  async expenseTransactions(@Parent() user: User): Promise<ExpenseTransaction[]> {
    return this.expenseTransactionRepository.find({
      where: { user: { id: user.id } },
    });
  }

  @ResolveField(() => [ExpenseCategory])
  async expenseCategory(@Parent() user: User): Promise<ExpenseCategory[]> {
    return this.expenseCategoryRepository.find({
      where: { user: { id: user.id } },
    });
  }
}
