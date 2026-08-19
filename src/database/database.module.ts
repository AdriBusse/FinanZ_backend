import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import path from "path";
import { User } from "../user/entities/user.entity";
import { UserIdentity } from "../user/entities/user-identity.entity";
import { Expense } from "../expense/entities/expense.entity";
import { ExpenseCategory } from "../expense/entities/expense-category.entity";
import { ExpenseTransaction } from "../expense/entities/expense-transaction.entity";
import { ExpenseTransactionTemplate } from "../expense/entities/expense-transaction-template.entity";
import { SavingDepot } from "../saving/entities/saving-depot.entity";
import { SavingTransaction } from "../saving/entities/saving-transaction.entity";
import { ETF } from "../etf/entities/etf.entity";
import { ETFTransaction } from "../etf/entities/etf-transaction.entity";

export const ENTITIES = [
  User,
  UserIdentity,
  Expense,
  ExpenseCategory,
  ExpenseTransaction,
  ExpenseTransactionTemplate,
  SavingDepot,
  SavingTransaction,
  ETF,
  ETFTransaction,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd =
          configService.get("prod") === "true" ||
          configService.get("prod") === "1" ||
          configService.get("NODE_ENV") === "production";

        return {
          type: "postgres",
          host: configService.get<string>("DB_HOST", "localhost"),
          port: Number(configService.get<number>("DB_PORT", 5432)),
          username: configService.get<string>("DB_USER", "admin"),
          password: configService.get<string>("DB_PASSWORD", "admin123"),
          database: configService.get<string>("DB_DATABASE", "finanz"),
          entities: ENTITIES,
          migrations: [path.join(__dirname, "..", "migrations", "*{.ts,.js}")],
          migrationsRun: true,
          synchronize: false,
          logging: !isProd,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
