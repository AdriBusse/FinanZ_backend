import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "../entities/expense.entity";
import { ExpenseTransaction } from "../entities/expense-transaction.entity";
import { ExpenseTransactionTemplate } from "../entities/expense-transaction-template.entity";
import { User } from "../../user/entities/user.entity";
import { ExpenseCategoryService } from "./expense-category.service";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseTransaction)
    private readonly transactionRepository: Repository<ExpenseTransaction>,
    @InjectRepository(ExpenseTransactionTemplate)
    private readonly templateRepository: Repository<ExpenseTransactionTemplate>,
    private readonly expenseCategoryService: ExpenseCategoryService
  ) {}

  async getExpenses(archived: boolean | undefined, user: User): Promise<Expense[]> {
    const isArchived = archived === undefined ? false : archived;
    return this.expenseRepository.find({
      where: {
        user: { id: user.id },
        archived: isArchived,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getExpense(id: number | string, user: User): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!expense) {
      throw new NotFoundException("Expense not found");
    }
    return expense;
  }

  async createExpense(
    title: string,
    currency: string | null,
    monthlyRecurring: boolean | null,
    spendingLimit: number | null,
    skipTemplateIds: string[] | null,
    user: User
  ): Promise<Expense> {
    // Check if user has categories, if not create default ones
    const userCategories = await this.expenseCategoryService.getExpenseCategories(user);
    if (!userCategories || userCategories.length === 0) {
      await this.expenseCategoryService.createDefaultExpenseCategories(user);
    }

    const expense = this.expenseRepository.create({
      title,
      currency: currency || "€",
      monthlyRecurring: monthlyRecurring ?? false,
      spendingLimit,
      user,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    if (savedExpense.monthlyRecurring) {
      const templates = await this.templateRepository.find({
        where: { user: { id: user.id } },
        relations: ["category"],
      });
      const skippedTemplateIds = new Set(skipTemplateIds ?? []);
      const transactions = templates
        .filter(template => !skippedTemplateIds.has(String(template.id)))
        .map(template =>
          this.transactionRepository.create({
            describtion: template.describtion,
            amount: template.amount,
            category: template.category || undefined,
            expense: savedExpense,
            user,
          })
        );

      if (transactions.length > 0) {
        await this.transactionRepository.save(transactions);
      }
    }

    return savedExpense;
  }

  async updateExpense(
    id: number | string,
    title?: string,
    currency?: string,
    archived?: boolean,
    monthlyRecurring?: boolean,
    spendingLimit?: number | null,
    user?: User
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: Number(id), user: { id: user?.id } },
    });
    if (!expense) {
      throw new NotFoundException("Expense not found");
    }

    if (title !== undefined) expense.title = title;
    if (currency !== undefined) expense.currency = currency;
    if (archived !== undefined) expense.archived = archived;
    if (monthlyRecurring !== undefined) expense.monthlyRecurring = monthlyRecurring;
    if (spendingLimit !== undefined) expense.spendingLimit = spendingLimit;

    return this.expenseRepository.save(expense);
  }

  async deleteExpense(id: number | string, user: User): Promise<boolean> {
    const expense = await this.expenseRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!expense) {
      throw new NotFoundException("Expense not found");
    }

    await this.expenseRepository.delete({ id: Number(id) });
    return true;
  }
}
