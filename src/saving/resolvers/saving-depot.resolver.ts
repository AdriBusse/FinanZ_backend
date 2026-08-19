import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Int,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SavingDepot } from "../entities/saving-depot.entity";
import { SavingTransaction } from "../entities/saving-transaction.entity";
import { User } from "../../user/entities/user.entity";
import { SavingDepotService } from "../services/saving-depot.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import {
  compareTransactionASC,
  compareTransactionDESC,
} from "../../common/utils/compare-transaction";

@Resolver(() => SavingDepot)
export class SavingDepotResolver {
  constructor(
    private readonly depotService: SavingDepotService,
    @InjectRepository(SavingDepot)
    private readonly depotRepository: Repository<SavingDepot>,
    @InjectRepository(SavingTransaction)
    private readonly transactionRepository: Repository<SavingTransaction>
  ) {}

  @Query(() => [SavingDepot])
  @UseGuards(GqlAuthGuard)
  async getSavingDepots(@CurrentUser() user: User): Promise<SavingDepot[]> {
    return this.depotService.getSavingDepots(user);
  }

  @Query(() => SavingDepot)
  @UseGuards(GqlAuthGuard)
  async getSavingDepot(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<SavingDepot> {
    return this.depotService.getSavingDepot(id, user);
  }

  @Mutation(() => SavingDepot)
  @UseGuards(GqlAuthGuard)
  async createSavingDepot(
    @Args("name") name: string,
    @Args("short") short: string,
    @Args("currency", { nullable: true }) currency: string,
    @Args("savinggoal", { nullable: true, type: () => Int }) savinggoal: number | null,
    @CurrentUser() user: User
  ): Promise<SavingDepot> {
    return this.depotService.createSavingDepot(
      name,
      short,
      currency,
      savinggoal,
      user
    );
  }

  @Mutation(() => SavingDepot)
  @UseGuards(GqlAuthGuard)
  async updateSavingDepot(
    @Args("id") id: string,
    @Args("name", { nullable: true }) name: string,
    @Args("short", { nullable: true }) short: string,
    @Args("currency", { nullable: true }) currency: string,
    @Args("savinggoal", { nullable: true, type: () => Int }) savinggoal: number | null,
    @CurrentUser() user: User
  ): Promise<SavingDepot> {
    return this.depotService.updateSavingDepot(
      id,
      name,
      short,
      currency,
      savinggoal,
      user
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteSavingDepot(
    @Args("id") id: string,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.depotService.deleteSavingDepot(id, user);
  }

  @ResolveField(() => [SavingTransaction], { nullable: true })
  async transactions(
    @Parent() savingDepot: SavingDepot,
    @Args("order", { defaultValue: "DESC" }) order: "DESC" | "ASC"
  ): Promise<SavingTransaction[]> {
    const savingTransactions = await this.transactionRepository.find({
      where: { depot: { id: savingDepot.id } },
    });

    if (order === "DESC") {
      return savingTransactions.sort(compareTransactionDESC);
    }

    return savingTransactions.sort(compareTransactionASC);
  }

  @ResolveField(() => User)
  async user(@Parent() savingDepot: SavingDepot): Promise<User> {
    const savingDepotRec = await this.depotRepository.findOneOrFail({
      where: { id: savingDepot.id },
      relations: ["user"],
    });

    return savingDepotRec.user;
  }

  @ResolveField(() => Number)
  async sum(@Parent() savingDepot: SavingDepot): Promise<number> {
    if (typeof savingDepot.sum === "number") {
      return savingDepot.sum;
    }

    const total = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("COALESCE(SUM(transaction.amount), 0)", "sum")
      .where("transaction.depotId = :depotId", { depotId: savingDepot.id })
      .getRawOne();

    return parseFloat(Number(total.sum).toFixed(2));
  }
}
