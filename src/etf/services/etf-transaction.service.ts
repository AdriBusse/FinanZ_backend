import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETFTransaction } from "../entities/etf-transaction.entity";
import { ETF } from "../entities/etf.entity";
import { User } from "../../user/entities/user.entity";
import { LemonApiService } from "./lemon-api.service";

@Injectable()
export class EtfTransactionService {
  constructor(
    @InjectRepository(ETFTransaction)
    private readonly transactionRepository: Repository<ETFTransaction>,
    @InjectRepository(ETF)
    private readonly etfRepository: Repository<ETF>,
    private readonly lemonApiService: LemonApiService
  ) {}

  async createETFTransaction(
    etfId: number | string,
    invest: number | undefined,
    fee: number | undefined,
    date: string | undefined,
    user: User
  ): Promise<ETFTransaction> {
    const etf = await this.etfRepository.findOne({
      where: { id: Number(etfId), user: { id: user.id } },
      relations: ["transactions"],
    });
    if (!etf) {
      throw new NotFoundException("Cannot find ETF!");
    }

    const lastquote = await this.lemonApiService.lastQuotes(etf.isin);
    if (!lastquote) {
      throw new BadRequestException(
        "Something went wrong while creating the ETFTransaction (external API didn't respond)"
      );
    }

    const investAmount = invest || 0;
    const feeAmount = fee || 0;
    const calculatedAmount = investAmount
      ? parseFloat((investAmount / lastquote.a).toFixed(2))
      : 0;

    let totalAmount = (etf.transactions || []).reduce((acc, cur) => {
      return acc + cur.amount;
    }, 0);
    totalAmount += calculatedAmount;

    const value = parseFloat((totalAmount * lastquote.a).toFixed(2));

    const transaction = this.transactionRepository.create({
      invest: investAmount,
      fee: feeAmount,
      amount: calculatedAmount,
      value,
      etf,
      createdAt: date ? new Date(date) : new Date(),
      user,
    });

    return this.transactionRepository.save(transaction);
  }

  async deleteETFTransaction(
    id: number | string,
    user: User
  ): Promise<boolean> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!transaction) {
      throw new NotFoundException("Cannot find ETF transaction!");
    }

    await this.transactionRepository.delete({ id: Number(id) });
    return true;
  }
}
