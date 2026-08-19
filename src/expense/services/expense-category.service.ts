import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpenseCategory } from "../entities/expense-category.entity";
import { User } from "../../user/entities/user.entity";
import { CategoryMetadataGQL } from "../types/category-metadata.type";
import { categoryMetadata } from "../constants/category-metadata";
import { defaultExpenseCategories } from "../constants/default-categories";

@Injectable()
export class ExpenseCategoryService {
  constructor(
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepository: Repository<ExpenseCategory>
  ) {}

  async getExpenseCategories(user: User): Promise<ExpenseCategory[]> {
    return this.categoryRepository.find({
      where: { user: { id: user.id } },
    });
  }

  getCategoryMetadata(): CategoryMetadataGQL {
    return categoryMetadata;
  }

  async createExpenseCategory(
    name: string,
    color?: string,
    icon?: string,
    user?: User
  ): Promise<ExpenseCategory> {
    const category = this.categoryRepository.create({
      name,
      color: color || "",
      icon: icon || "",
      user,
    });

    return this.categoryRepository.save(category);
  }

  async createDefaultExpenseCategories(user: User): Promise<ExpenseCategory[]> {
    const createdCategories: ExpenseCategory[] = [];

    for (const def of defaultExpenseCategories) {
      const existing = await this.categoryRepository.findOne({
        where: { name: def.name, user: { id: user.id } },
      });

      if (!existing) {
        const iconEntry = categoryMetadata.icons.find(
          (i) => i.keyword === def.iconKeyword
        );
        const colorEntry = def.colorKey
          ? categoryMetadata.colors.find((c) => c.key === def.colorKey)
          : undefined;

        const category = this.categoryRepository.create({
          name: def.name,
          icon: iconEntry ? iconEntry.icon : "tag",
          color: colorEntry ? colorEntry.hex : "#3b82f6",
          user,
        });

        const saved = await this.categoryRepository.save(category);
        createdCategories.push(saved);
      }
    }

    return createdCategories;
  }

  async updateExpenseCategory(
    id: number | string,
    name?: string,
    color?: string,
    icon?: string,
    user?: User
  ): Promise<ExpenseCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(id), user: { id: user?.id } },
    });
    if (!category) {
      throw new NotFoundException("Expense category not found");
    }

    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;
    if (icon !== undefined) category.icon = icon;

    return this.categoryRepository.save(category);
  }

  async deleteExpenseCategory(
    id: number | string,
    user: User
  ): Promise<boolean> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!category) {
      throw new NotFoundException("Expense category not found");
    }

    await this.categoryRepository.delete({ id: Number(id) });
    return true;
  }
}
