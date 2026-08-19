import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETFTransaction } from "../entities/etf-transaction.entity";
import { ETF } from "../entities/etf.entity";
import { User } from "../../user/entities/user.entity";
import { EtfTransactionService } from "../services/etf-transaction.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Resolver(() => ETFTransaction)
export class EtfTransactionResolver {
  constructor(
    private readonly transactionService: EtfTransactionService,
    @InjectRepository(ETFTransaction)
    private readonly transactionRepository: Repository<ETFTransaction>
  ) {}

  @Mutation(() => ETFTransaction)
  @UseGuards(GqlAuthGuard)
  async createETFTransaction(
    @Args("etfId") etfId: string,
    @Args("invest", { nullable: true }) invest: number,
    @Args("fee", { nullable: true, defaultValue: 0 }) fee: number,
    @Args("date", { nullable: true }) date: string,
    @CurrentUser() user: User
  ): Promise<ETFTransaction> {
    return this.transactionService.createETFTransaction(
      etfId,
      invest,
      fee,
      date,
      user
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteETFTransaction(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.transactionService.deleteETFTransaction(id, user);
  }

  @ResolveField(() => User)
  async user(@Parent() transaction: ETFTransaction): Promise<User> {
    const trans = await this.transactionRepository.findOneOrFail({
      where: { id: transaction.id },
      relations: ["user"],
    });
    return trans.user;
  }

  @ResolveField(() => ETF)
  async etf(@Parent() transaction: ETFTransaction): Promise<ETF> {
    const trans = await this.transactionRepository.findOneOrFail({
      where: { id: transaction.id },
      relations: ["etf"],
    });
    return trans.etf;
  }
}
