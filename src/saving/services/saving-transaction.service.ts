import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SavingTransaction } from "../entities/saving-transaction.entity";
import { SavingDepot } from "../entities/saving-depot.entity";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class SavingTransactionService {
  constructor(
    @InjectRepository(SavingTransaction)
    private readonly transactionRepository: Repository<SavingTransaction>,
    @InjectRepository(SavingDepot)
    private readonly depotRepository: Repository<SavingDepot>
  ) {}

  async createSavingTransaction(
    describtion: string,
    amount: number,
    depotId: number | string,
    date: number | undefined,
    user: User,
    parentTransactionId?: string
  ): Promise<SavingTransaction> {
    const depot = await this.depotRepository.findOne({
      where: { id: Number(depotId), user: { id: user.id } },
    });
    if (!depot) {
      throw new NotFoundException("Cannot find Depot!");
    }

    let rootId: number | null = null;
    if (parentTransactionId != null) {
      const parent = await this.transactionRepository.findOne({
        where: { id: Number(parentTransactionId), user: { id: user.id }, depot: { id: depot.id } },
      });
      if (!parent) throw new NotFoundException("Cannot find connected transaction in this depot!");
      rootId = parent.parentTransactionId ?? parent.id;
    }

    const transaction = this.transactionRepository.create({
      parentTransactionId: rootId,
      describtion,
      amount,
      depot,
      createdAt: date ? new Date(date) : new Date(),
      user,
    });

    return this.transactionRepository.save(transaction);
  }

  async updateSavingTransaction(
    transactionId: number | string,
    describtion?: string,
    amount?: number,
    date?: string,
    user?: User
  ): Promise<SavingTransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: Number(transactionId), user: { id: user?.id } },
      relations: ["depot"],
    });
    if (!transaction) {
      throw new NotFoundException("Cannot find Transaction!");
    }

    if (describtion !== undefined) transaction.describtion = describtion;
    if (amount !== undefined) transaction.amount = amount;
    if (date !== undefined) transaction.createdAt = new Date(date);

    return this.transactionRepository.save(transaction);
  }

  async deleteSavingTransaction(
    id: number | string,
    user: User
  ): Promise<boolean> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: Number(id), user: { id: user.id } },
    });
    if (!transaction) {
      throw new NotFoundException("Cannot find Transaction!");
    }

    await this.transactionRepository.delete({ id: Number(id) });
    return true;
  }
}
