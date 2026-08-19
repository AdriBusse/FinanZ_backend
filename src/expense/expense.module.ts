import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expense } from "./entities/expense.entity";
import { ExpenseCategory } from "./entities/expense-category.entity";
import { ExpenseTransaction } from "./entities/expense-transaction.entity";
import { ExpenseTransactionTemplate } from "./entities/expense-transaction-template.entity";
import { User } from "../user/entities/user.entity";
import { ExpenseService } from "./services/expense.service";
import { ExpenseCategoryService } from "./services/expense-category.service";
import { ExpenseTransactionService } from "./services/expense-transaction.service";
import { ExpenseTemplateService } from "./services/expense-template.service";
import { ExpenseResolver } from "./resolvers/expense.resolver";
import { ExpenseCategoryResolver } from "./resolvers/expense-category.resolver";
import { ExpenseTransactionResolver } from "./resolvers/expense-transaction.resolver";
import { ExpenseTemplateResolver } from "./resolvers/expense-template.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Expense,
      ExpenseCategory,
      ExpenseTransaction,
      ExpenseTransactionTemplate,
      User,
    ]),
    AuthModule,
  ],
  providers: [
    ExpenseService,
    ExpenseCategoryService,
    ExpenseTransactionService,
    ExpenseTemplateService,
    ExpenseResolver,
    ExpenseCategoryResolver,
    ExpenseTransactionResolver,
    ExpenseTemplateResolver,
  ],
  exports: [
    ExpenseService,
    ExpenseCategoryService,
    ExpenseTransactionService,
    ExpenseTemplateService,
  ],
})
export class ExpenseModule {}
