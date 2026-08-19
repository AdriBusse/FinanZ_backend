import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { Expense } from "../expense/entities/expense.entity";
import { ExpenseTransaction } from "../expense/entities/expense-transaction.entity";
import { SavingDepot } from "../saving/entities/saving-depot.entity";
import { ETF } from "../etf/entities/etf.entity";
import { UserSummary } from "./types/user-summary.type";
import { LemonApiService } from "../etf/services/lemon-api.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseTransaction)
    private readonly expenseTransactionRepository: Repository<ExpenseTransaction>,
    @InjectRepository(SavingDepot)
    private readonly savingDepotRepository: Repository<SavingDepot>,
    @InjectRepository(ETF)
    private readonly etfRepository: Repository<ETF>,
    private readonly lemonApiService: LemonApiService
  ) {}

  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    user: User
  ): Promise<boolean> {
    if (!user) {
      throw new UnauthorizedException("Unauthenticated");
    }

    if (!user.password) {
      throw new BadRequestException("Use Google verification to set a password");
    }

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      throw new BadRequestException("Current password is incorrect");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException("New password must be at least 6 characters long");
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await this.userRepository.save(user);
    return true;
  }

  async getSummary(user: User): Promise<UserSummary> {
    if (!user) {
      throw new UnauthorizedException("Unauthenticated");
    }

    const latestExpense = await this.expenseRepository.findOne({
      where: { user: { id: user.id } },
      order: { createdAt: "DESC" },
    });

    const etfs = await this.etfRepository.find({
      where: { user: { id: user.id } },
      relations: ["transactions"],
    });

    let etfInvested = 0;
    etfs.forEach((etf) => {
      etf.transactions?.forEach((transaction) => {
        etfInvested += transaction.invest;
        etfInvested += transaction.fee;
      });
    });

    let etfWorth = 0;
    for (const etf of etfs) {
      const etfAmount = (etf.transactions || []).reduce((acc, transaction) => {
        return acc + transaction.amount;
      }, 0);

      const res = await this.lemonApiService.getETFWorth(etf.isin, etfAmount);
      etfWorth += res;
    }

    let percentMovement = 0;
    if (etfInvested !== 0 && etfWorth !== 0) {
      percentMovement = parseFloat(
        ((etfWorth * 100) / etfInvested - 100).toFixed(2)
      );
    }

    const todayExpenses = await this.expenseTransactionRepository.find({
      where: {
        user: { id: user.id },
        createdAt: Between(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          new Date()
        ),
      },
    });

    const savings = await this.savingDepotRepository.find({
      where: { user: { id: user.id } },
      relations: ["transactions"],
    });

    let totalSaving = 0;
    savings.forEach((saving) => {
      saving.transactions?.forEach((transaction) => {
        totalSaving += transaction.amount;
      });
    });

    const summary = new UserSummary();
    summary.latestExpense = latestExpense || null;
    summary.todaySpent = todayExpenses;
    summary.etfWorth = parseFloat(etfWorth.toFixed(2));
    summary.etfMovement = percentMovement;
    summary.savingValue = totalSaving;

    return summary;
  }
}
