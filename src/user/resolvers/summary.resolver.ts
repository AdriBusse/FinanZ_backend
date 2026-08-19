import { Resolver, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { UserSummary } from "../types/user-summary.type";
import { UserService } from "../user.service";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { User } from "../entities/user.entity";

@Resolver(() => UserSummary)
export class SummaryResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserSummary)
  @UseGuards(GqlAuthGuard)
  async summary(@CurrentUser() user: User): Promise<UserSummary> {
    return this.userService.getSummary(user);
  }
}
