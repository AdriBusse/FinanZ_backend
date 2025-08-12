import { ExpenseTransactionTemplate } from "../../../entity/ExpenseTransactionTemplate";
import { ExpenseCategory } from "../../../entity/ExpenseCategory";
import { User } from "../../../entity/User";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";

@Resolver(() => ExpenseTransactionTemplate)
export class ExpenseTransactionTemplateResolver
  implements ResolverInterface<ExpenseTransactionTemplate>
{
  @FieldResolver()
  async user(@Root() template: ExpenseTransactionTemplate): Promise<User> {
    const rec = await ExpenseTransactionTemplate.findOneOrFail(template.id, {
      relations: ["user"],
    });
    return rec.user;
  }

  @FieldResolver()
  async category(
    @Root() template: ExpenseTransactionTemplate
  ): Promise<ExpenseCategory> {
    const rec = await ExpenseTransactionTemplate.findOneOrFail(template.id, {
      relations: ["category"],
    });
    return rec.category;
  }
}
