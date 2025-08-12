import { Arg, Ctx, Field, Float, ID, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../../types/MyContext";
import { ExpenseCategory } from "../../../entity/ExpenseCategory";
import { isAuth } from "../../middleware/isAuth";

@ObjectType()
class CategoryScoreType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Float)
  score!: number;
}

@ObjectType()
class CategorizeExpenseResultType {
  @Field(() => CategoryScoreType, { nullable: true })
  best?: CategoryScoreType;

  @Field(() => [CategoryScoreType])
  candidates!: CategoryScoreType[];
}

@Resolver()
export class CategorizeExpenseResolver {
  @Query(() => CategorizeExpenseResultType)
  @UseMiddleware(isAuth)
  async categorizeExpense(
    @Arg("title") title: string,
    @Arg("multiLabel", () => Boolean, { defaultValue: false }) multiLabel: boolean,
    @Ctx() ctx: MyContext
  ): Promise<CategorizeExpenseResultType> {
    const user = ctx.res.locals.user;

    // Load user's expense categories
    const categories = await ExpenseCategory.find({ user });
    if (!categories?.length) {
      return { best: undefined, candidates: [] };
    }

    // Prepare labels and a name->entity map for association
    const labels = categories.map((c) => c.name);
    const nameToCategory = new Map<string, ExpenseCategory>();
    for (const c of categories) nameToCategory.set(c.name, c);

    // Run AI classification
    const out = await ctx.ai.categorizeExpense(title, labels, multiLabel);

    // Map AI results back to category IDs using label->category name
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
