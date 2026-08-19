import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpenseTransaction } from "../entities/expense-transaction.entity";
import { Expense } from "../entities/expense.entity";
import { ExpenseCategory } from "../entities/expense-category.entity";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class ExpenseTransactionService {
  constructor(
    @InjectRepository(ExpenseTransaction)
    private readonly transactionRepository: Repository<ExpenseTransaction>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepository: Repository<ExpenseCategory>
  ) {}

  async createExpenseTransaction(
    amount: number,
    date: Date | undefined,
    describtion: string,
    expenseId: number | string,
    categoryId: number | string | undefined,
    user: User
  ): Promise<ExpenseTransaction> {
    const expense = await this.expenseRepository.findOne({
      where: { id: Number(expenseId), user: { id: user.id } },
    });
    if (!expense) {
      throw new NotFoundException("Expense not found");
    }

    let category: ExpenseCategory | null = null;
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: Number(categoryId), user: { id: user.id } },
      });
    }

    const transaction = this.transactionRepository.create({
      amount,
      describtion,
      createdAt: date || new Date(),
      expense,
      category: category || undefined,
      user,
    });

    return this.transactionRepository.save(transaction);
  }

  async updateExpenseTransaction(
    id: number | string,
    amount?: number,
    date?: Date,
    describtion?: string,
    categoryId?: number | string,
    expenseId?: number | string,
    user?: User
  ): Promise<ExpenseTransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: Number(id), user: { id: user?.id } },
      relations: ["category", "expense"],
    });
    if (!transaction) {
      throw new NotFoundException("Expense transaction not found");
    }

    if (amount !== undefined) transaction.amount = amount;
    if (describtion !== undefined) transaction.describtion = describtion;
    if (date !== undefined) transaction.createdAt = date;

    if (expenseId !== undefined) {
      const expense = await this.expenseRepository.findOne({
        where: { id: Number(expenseId), user: { id: user?.id } },
      });
      if (expense) {
        transaction.expense = expense;
      }
    }

    if (categoryId !== undefined) {
      if (categoryId === null || categoryId === "") {
        transaction.category = null as any;
      } else {
        const category = await this.categoryRepository.findOne({
          where: { id: Number(categoryId), user: { id: user?.id } },
        });
        if (category) {
          transaction.category = category;
        }
      }
    }

    return this.transactionRepository.save(transaction);
  }

  async deleteExpenseTransaction(
    id: number | string,
    user: User
  ): Promise<boolean> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!transaction) {
      throw new NotFoundException("Expense transaction not found");
    }

    await this.transactionRepository.delete({ id: Number(id) });
    return true;
  }
}
