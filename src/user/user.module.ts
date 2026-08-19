import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserIdentity } from "./entities/user-identity.entity";
import { Expense } from "../expense/entities/expense.entity";
import { ExpenseCategory } from "../expense/entities/expense-category.entity";
import { ExpenseTransaction } from "../expense/entities/expense-transaction.entity";
import { SavingDepot } from "../saving/entities/saving-depot.entity";
import { SavingTransaction } from "../saving/entities/saving-transaction.entity";
import { ETF } from "../etf/entities/etf.entity";
import { ETFTransaction } from "../etf/entities/etf-transaction.entity";
import { UserService } from "./user.service";
import { UserResolver } from "./resolvers/user.resolver";
import { SummaryResolver } from "./resolvers/summary.resolver";
import { EtfModule } from "../etf/etf.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserIdentity,
      Expense,
      ExpenseCategory,
      ExpenseTransaction,
      SavingDepot,
      SavingTransaction,
      ETF,
      ETFTransaction,
    ]),
    forwardRef(() => EtfModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, UserResolver, SummaryResolver],
  exports: [UserService],
})
export class UserModule {}
