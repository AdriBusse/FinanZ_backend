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
import { ExpenseTransactionTemplate } from "../entities/expense-transaction-template.entity";
import { ExpenseCategory } from "../entities/expense-category.entity";
import { User } from "../../user/entities/user.entity";
import { ExpenseTemplateService } from "../services/expense-template.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Resolver(() => ExpenseTransactionTemplate)
export class ExpenseTemplateResolver {
  constructor(
    private readonly templateService: ExpenseTemplateService,
    @InjectRepository(ExpenseTransactionTemplate)
    private readonly templateRepository: Repository<ExpenseTransactionTemplate>
  ) {}

  @Query(() => [ExpenseTransactionTemplate])
  @UseGuards(GqlAuthGuard)
  async getExpenseTransactionTemplates(
    @CurrentUser() user: User
  ): Promise<ExpenseTransactionTemplate[]> {
    return this.templateService.getExpenseTransactionTemplates(user);
  }

  @Query(() => ExpenseTransactionTemplate)
  @UseGuards(GqlAuthGuard)
  async getExpenseTransactionTemplate(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<ExpenseTransactionTemplate> {
    return this.templateService.getExpenseTransactionTemplate(id, user);
  }

  @Mutation(() => ExpenseTransactionTemplate)
  @UseGuards(GqlAuthGuard)
  async createExpenseTransactionTemplate(
    @Args("describtion") describtion: string,
    @Args("amount") amount: number,
    @Args("categoryId", { nullable: true }) categoryId: string,
    @CurrentUser() user: User
  ): Promise<ExpenseTransactionTemplate> {
    return this.templateService.createExpenseTransactionTemplate(
      describtion,
      amount,
      categoryId,
      user
    );
  }

  @Mutation(() => ExpenseTransactionTemplate)
  @UseGuards(GqlAuthGuard)
  async updateExpenseTransactionTemplate(
    @Args("id") id: string,
    @Args("describtion", { nullable: true }) describtion: string,
    @Args("amount", { nullable: true }) amount: number,
    @Args("categoryId", { nullable: true }) categoryId: string,
    @CurrentUser() user: User
  ): Promise<ExpenseTransactionTemplate> {
    return this.templateService.updateExpenseTransactionTemplate(
      id,
      describtion,
      amount,
      categoryId,
      user
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteExpenseTransactionTemplate(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.templateService.deleteExpenseTransactionTemplate(id, user);
  }

  @ResolveField(() => User)
  async user(
    @Parent() template: ExpenseTransactionTemplate
  ): Promise<User> {
    const tmpl = await this.templateRepository.findOneOrFail({
      where: { id: template.id },
      relations: ["user"],
    });
    return tmpl.user;
  }

  @ResolveField(() => ExpenseCategory, { nullable: true })
  async category(
    @Parent() template: ExpenseTransactionTemplate
  ): Promise<ExpenseCategory | null> {
    const tmpl = await this.templateRepository.findOne({
      where: { id: template.id },
      relations: ["category"],
    });
    return tmpl?.category || null;
  }
}
