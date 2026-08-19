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
import { ExpenseCategory } from "../entities/expense-category.entity";
import { ExpenseTransaction } from "../entities/expense-transaction.entity";
import { User } from "../../user/entities/user.entity";
import { CategoryMetadataGQL } from "../types/category-metadata.type";
import { ExpenseCategoryService } from "../services/expense-category.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Resolver(() => ExpenseCategory)
export class ExpenseCategoryResolver {
  constructor(
    private readonly categoryService: ExpenseCategoryService,
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepository: Repository<ExpenseCategory>,
    @InjectRepository(ExpenseTransaction)
    private readonly transactionRepository: Repository<ExpenseTransaction>
  ) {}

  @Query(() => [ExpenseCategory])
  @UseGuards(GqlAuthGuard)
  async getExpenseCategories(
    @CurrentUser() user: User
  ): Promise<ExpenseCategory[]> {
    return this.categoryService.getExpenseCategories(user);
  }

  @Query(() => CategoryMetadataGQL)
  getCategoryMetadata(): CategoryMetadataGQL {
    return this.categoryService.getCategoryMetadata();
  }

  @Mutation(() => ExpenseCategory)
  @UseGuards(GqlAuthGuard)
  async createExpenseCategory(
    @Args("name") name: string,
    @Args("color", { nullable: true }) color: string,
    @Args("icon", { nullable: true }) icon: string,
    @CurrentUser() user: User
  ): Promise<ExpenseCategory> {
    return this.categoryService.createExpenseCategory(name, color, icon, user);
  }

  @Mutation(() => [ExpenseCategory])
  @UseGuards(GqlAuthGuard)
  async createDefaultExpenseCategories(
    @CurrentUser() user: User
  ): Promise<ExpenseCategory[]> {
    return this.categoryService.createDefaultExpenseCategories(user);
  }

  @Mutation(() => ExpenseCategory)
  @UseGuards(GqlAuthGuard)
  async updateExpenseCategory(
    @Args("id") id: string,
    @Args("name", { nullable: true }) name: string,
    @Args("color", { nullable: true }) color: string,
    @Args("icon", { nullable: true }) icon: string,
    @CurrentUser() user: User
  ): Promise<ExpenseCategory> {
    return this.categoryService.updateExpenseCategory(id, name, color, icon, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteExpenseCategory(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.categoryService.deleteExpenseCategory(id, user);
  }

  @ResolveField(() => User)
  async user(@Parent() category: ExpenseCategory): Promise<User> {
    const cat = await this.categoryRepository.findOneOrFail({
      where: { id: category.id },
      relations: ["user"],
    });
    return cat.user;
  }

  @ResolveField(() => [ExpenseTransaction], { nullable: true })
  async transactions(
    @Parent() category: ExpenseCategory
  ): Promise<ExpenseTransaction[]> {
    return this.transactionRepository.find({
      where: { category: { id: category.id } },
    });
  }
}
