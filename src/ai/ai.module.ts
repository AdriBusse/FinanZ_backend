import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expense } from "../expense/entities/expense.entity";
import { ExpenseCategory } from "../expense/entities/expense-category.entity";
import { ExpenseTransaction } from "../expense/entities/expense-transaction.entity";
import { User } from "../user/entities/user.entity";
import { AiService } from "./services/ai.service";
import { VoiceService } from "./services/voice.service";
import { AiResolver } from "./resolvers/ai.resolver";
import { VoiceResolver } from "./resolvers/voice.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Expense,
      ExpenseCategory,
      ExpenseTransaction,
      User,
    ]),
    AuthModule,
  ],
  providers: [AiService, VoiceService, AiResolver, VoiceResolver],
  exports: [AiService, VoiceService],
})
export class AiModule {}
