import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SavingTransaction } from "../entities/saving-transaction.entity";
import { SavingDepot } from "../entities/saving-depot.entity";
import { User } from "../../user/entities/user.entity";
import { SavingTransactionService } from "../services/saving-transaction.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Resolver(() => SavingTransaction)
export class SavingTransactionResolver {
  constructor(
    private readonly transactionService: SavingTransactionService,
    @InjectRepository(SavingTransaction)
    private readonly transactionRepository: Repository<SavingTransaction>
  ) {}

  @Mutation(() => SavingTransaction)
  @UseGuards(GqlAuthGuard)
  async createSavingTransaction(
    @Args("describtion") describtion: string,
    @Args("amount") amount: number,
    @Args("depotId") depotId: string,
    @Args("date", { nullable: true, type: () => Int }) date: number,
    @CurrentUser() user: User
  ): Promise<SavingTransaction> {
    return this.transactionService.createSavingTransaction(
      describtion,
      amount,
      depotId,
      date,
      user
    );
  }

  @Mutation(() => SavingTransaction)
  @UseGuards(GqlAuthGuard)
  async updateSavingTransaction(
    @Args("transactionId", { type: () => Int }) transactionId: number,
    @Args("describtion", { nullable: true }) describtion: string,
    @Args("amount", { nullable: true }) amount: number,
    @Args("date", { nullable: true }) date: string,
    @CurrentUser() user: User
  ): Promise<SavingTransaction> {
    return this.transactionService.updateSavingTransaction(
      transactionId,
      describtion,
      amount,
      date,
      user
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteSavingTransaction(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.transactionService.deleteSavingTransaction(id, user);
  }

  @ResolveField(() => User)
  async user(@Parent() transaction: SavingTransaction): Promise<User> {
    const trans = await this.transactionRepository.findOneOrFail({
      where: { id: transaction.id },
      relations: ["user"],
    });
    return trans.user;
  }

  @ResolveField(() => SavingDepot)
  async depot(@Parent() transaction: SavingTransaction): Promise<SavingDepot> {
    const trans = await this.transactionRepository.findOneOrFail({
      where: { id: transaction.id },
      relations: ["depot"],
    });
    return trans.depot;
  }
}
