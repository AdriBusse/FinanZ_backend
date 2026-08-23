import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpenseTransactionTemplate } from "../entities/expense-transaction-template.entity";
import { ExpenseCategory } from "../entities/expense-category.entity";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class ExpenseTemplateService {
  constructor(
    @InjectRepository(ExpenseTransactionTemplate)
    private readonly templateRepository: Repository<ExpenseTransactionTemplate>,
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepository: Repository<ExpenseCategory>
  ) {}

  async getExpenseTransactionTemplates(
    user: User
  ): Promise<ExpenseTransactionTemplate[]> {
    return this.templateRepository.find({
      where: { user: { id: user.id } },
      relations: ["category"],
    });
  }

  async getExpenseTransactionTemplate(
    id: number | string,
    user: User
  ): Promise<ExpenseTransactionTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
      relations: ["category"],
    });
    if (!template) {
      throw new NotFoundException("Expense transaction template not found");
    }
    return template;
  }

  async createExpenseTransactionTemplate(
    name: string,
    amount: number,
    categoryId: number | string | undefined,
    user: User
  ): Promise<ExpenseTransactionTemplate> {
    let category: ExpenseCategory | null = null;
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: Number(categoryId), user: { id: user.id } },
      });
    }

    const template = this.templateRepository.create({
      describtion: name,
      amount,
      category: category || undefined,
      user,
    });

    return this.templateRepository.save(template);
  }

  async updateExpenseTransactionTemplate(
    id: number | string,
    name?: string,
    amount?: number,
    categoryId?: number | string,
    user?: User
  ): Promise<ExpenseTransactionTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id: Number(id), user: { id: user?.id } },
      relations: ["category"],
    });
    if (!template) {
      throw new NotFoundException("Expense transaction template not found");
    }

    if (name !== undefined) template.describtion = name;
    if (amount !== undefined) template.amount = amount;

    if (categoryId !== undefined) {
      if (categoryId === null || categoryId === "") {
        template.category = null as any;
      } else {
        const category = await this.categoryRepository.findOne({
          where: { id: Number(categoryId), user: { id: user?.id } },
        });
        if (category) {
          template.category = category;
        }
      }
    }

    return this.templateRepository.save(template);
  }

  async deleteExpenseTransactionTemplate(
    id: number | string,
    user: User
  ): Promise<boolean> {
    const template = await this.templateRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!template) {
      throw new NotFoundException("Expense transaction template not found");
    }

    await this.templateRepository.delete({ id: Number(id) });
    return true;
  }
}
