import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETF } from "../entities/etf.entity";
import { ETFTransaction } from "../entities/etf-transaction.entity";
import { ETFSearch } from "../types/etf-search.type";
import { User } from "../../user/entities/user.entity";
import { EtfService } from "../services/etf.service";
import { LemonApiService } from "../services/lemon-api.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import {
  compareTransactionASC,
  compareTransactionDESC,
} from "../../common/utils/compare-transaction";

@Resolver(() => ETF)
export class EtfResolver {
  constructor(
    private readonly etfService: EtfService,
    private readonly lemonApiService: LemonApiService,
    @InjectRepository(ETF)
    private readonly etfRepository: Repository<ETF>,
    @InjectRepository(ETFTransaction)
    private readonly transactionRepository: Repository<ETFTransaction>
  ) {}

  @Query(() => [ETF])
  @UseGuards(GqlAuthGuard)
  async getETFs(@CurrentUser() user: User): Promise<ETF[]> {
    return this.etfService.getETFs(user);
  }

  @Query(() => ETF)
  @UseGuards(GqlAuthGuard)
  async getETF(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<ETF> {
    return this.etfService.getETF(id, user);
  }

  @Query(() => ETFSearch)
  @UseGuards(GqlAuthGuard)
  async searchETF(@Args("searchKey") searchKey: string): Promise<ETFSearch> {
    return this.etfService.searchETF(searchKey);
  }

  @Mutation(() => ETF)
  @UseGuards(GqlAuthGuard)
  async createETF(
    @Args("isin") isin: string,
    @CurrentUser() user: User
  ): Promise<ETF> {
    return this.etfService.createETF(isin, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteETF(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.etfService.deleteETF(id, user);
  }

  @ResolveField(() => [ETFTransaction], { nullable: true })
  async transactions(
    @Parent() etf: ETF,
    @Args("order", { defaultValue: "DESC" }) order: "DESC" | "ASC"
  ): Promise<ETFTransaction[]> {
    const etfTransactions = await this.transactionRepository.find({
      where: { etf: { id: etf.id } },
    });

    if (order === "DESC") {
      return etfTransactions.sort(compareTransactionDESC);
    }
    return etfTransactions.sort(compareTransactionASC);
  }

  @ResolveField(() => User)
  async user(@Parent() etf: ETF): Promise<User> {
    const etfRec = await this.etfRepository.findOneOrFail({
      where: { id: etf.id },
      relations: ["user"],
    });

    return etfRec.user;
  }

  @ResolveField(() => Number)
  async deposited(@Parent() etf: ETF): Promise<number> {
    let sum = 0;
    const deposits = await this.transactionRepository.find({
      where: { etf: { id: etf.id } },
    });

    deposits.forEach((dep) => {
      sum += dep.invest;
      sum += dep.fee;
    });

    return sum;
  }

  @ResolveField(() => Number)
  async worth(@Parent() etf: ETF): Promise<number> {
    const transactions = await this.transactionRepository.find({
      where: { etf: { id: etf.id } },
    });

    const amount = transactions.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

    return this.lemonApiService.getETFWorth(etf.isin, amount);
  }

  @ResolveField(() => Number)
  async amount(@Parent() etf: ETF): Promise<number> {
    const transactions = await this.transactionRepository.find({
      where: { etf: { id: etf.id } },
    });

    const amount = transactions.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

    return parseFloat(amount.toFixed(2));
  }
}
