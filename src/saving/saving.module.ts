import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SavingDepot } from "./entities/saving-depot.entity";
import { SavingTransaction } from "./entities/saving-transaction.entity";
import { User } from "../user/entities/user.entity";
import { SavingDepotService } from "./services/saving-depot.service";
import { SavingTransactionService } from "./services/saving-transaction.service";
import { SavingDepotResolver } from "./resolvers/saving-depot.resolver";
import { SavingTransactionResolver } from "./resolvers/saving-transaction.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SavingDepot, SavingTransaction, User]),
    AuthModule,
  ],
  providers: [
    SavingDepotService,
    SavingTransactionService,
    SavingDepotResolver,
    SavingTransactionResolver,
  ],
  exports: [SavingDepotService, SavingTransactionService],
})
export class SavingModule {}
