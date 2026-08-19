import { Resolver, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpenseCategory } from "../../expense/entities/expense-category.entity";
import { User } from "../../user/entities/user.entity";
import { AiService } from "../services/ai.service";
import {
  CategorizeExpenseResultType,
  CategoryScoreType,
} from "../types/categorize-expense-result.type";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Resolver()
export class AiResolver {
  constructor(
    private readonly aiService: AiService,
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepository: Repository<ExpenseCategory>
  ) {}

  @Query(() => CategorizeExpenseResultType)
  @UseGuards(GqlAuthGuard)
  async categorizeExpense(
    @Args("title") title: string,
    @Args("multiLabel", { defaultValue: false, nullable: true })
    multiLabel: boolean,
    @CurrentUser() user: User
  ): Promise<CategorizeExpenseResultType> {
    const categories = await this.categoryRepository.find({
      where: { user: { id: user.id } },
    });
    if (!categories?.length) {
      return { best: undefined, candidates: [] };
    }

    const labels = categories.map((c) => c.name);
    const nameToCategory = new Map<string, ExpenseCategory>();
    for (const c of categories) nameToCategory.set(c.name, c);

    const out = await this.aiService.categorizeExpense(title, labels, multiLabel);

    const candidates: CategoryScoreType[] = [];
    for (let i = 0; i < out.labels.length; i++) {
      const label = out.labels[i];
      const score = out.scores[i];
      const cat = nameToCategory.get(label);
      if (cat) {
        candidates.push({ id: String(cat.id), name: cat.name, score });
      }
    }

    return {
      best: candidates[0],
      candidates,
    };
  }
}
