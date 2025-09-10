import { Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../../middleware/isAuth";
import { MyContext } from "../../../../types/MyContext";
import { ExpenseCategory } from "../../../../entity/ExpenseCategory";
import defaultExpenseCategories from "../../../../constants/defaultExpenseCategories";
import categoryMetadata from "../../../../constants/categoryMetadata";

@Resolver(ExpenseCategory)
export class CreateDefaultExpenseCategoriesResolver {
  @Mutation(() => [ExpenseCategory])
  @UseMiddleware(isAuth)
  async createDefaultExpenseCategories(
    @Ctx() ctx: MyContext
  ): Promise<ExpenseCategory[]> {
    const user = ctx.res.locals.user;

    // If the user already has at least one category, return their categories unchanged
    const existing = await ExpenseCategory.find({ user });
    if (existing.length > 0) {
      return existing;
    }

    const iconsByKeyword = new Map(categoryMetadata.icons.map((i) => [i.keyword, i.icon] as const));
    const colorHexes = categoryMetadata.colors.map((c) => c.hex);

    const created: ExpenseCategory[] = [];
    for (let i = 0; i < defaultExpenseCategories.length; i++) {
      const def = defaultExpenseCategories[i];
      const cat = new ExpenseCategory();
      cat.name = def.name;
      cat.icon = iconsByKeyword.get(def.iconKeyword) || null as any;
      // Cycle through available colors for some variety
      cat.color = colorHexes.length > 0 ? colorHexes[i % colorHexes.length] : null as any;
      cat.user = user;
      await cat.save();
      created.push(cat);
    }

    return created;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
