import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "../entities/expense.entity";
import { User } from "../../user/entities/user.entity";
import { ExpenseCategoryService } from "./expense-category.service";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
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
    name: string,
    currency: string,
    user: User
  ): Promise<Expense> {
    // Check if user has categories, if not create default ones
    const userCategories = await this.expenseCategoryService.getExpenseCategories(user);
    if (!userCategories || userCategories.length === 0) {
      await this.expenseCategoryService.createDefaultExpenseCategories(user);
    }

    const expense = this.expenseRepository.create({
      title: name,
      currency: currency || "€",
      user,
    });

    return this.expenseRepository.save(expense);
  }

  async updateExpense(
    id: number | string,
    name?: string,
    currency?: string,
    isArchived?: boolean,
    spendingLimit?: number,
    user?: User
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: Number(id), user: { id: user?.id } },
    });
    if (!expense) {
      throw new NotFoundException("Expense not found");
    }

    if (name !== undefined) expense.title = name;
    if (currency !== undefined) expense.currency = currency;
    if (isArchived !== undefined) expense.archived = isArchived;
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
