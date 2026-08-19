import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ETF } from "./entities/etf.entity";
import { ETFTransaction } from "./entities/etf-transaction.entity";
import { User } from "../user/entities/user.entity";
import { LemonApiService } from "./services/lemon-api.service";
import { EtfService } from "./services/etf.service";
import { EtfTransactionService } from "./services/etf-transaction.service";
import { EtfResolver } from "./resolvers/etf.resolver";
import { EtfTransactionResolver } from "./resolvers/etf-transaction.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([ETF, ETFTransaction, User]), AuthModule],
  providers: [
    LemonApiService,
    EtfService,
    EtfTransactionService,
    EtfResolver,
    EtfTransactionResolver,
  ],
  exports: [LemonApiService, EtfService, EtfTransactionService],
})
export class EtfModule {}
