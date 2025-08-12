import { ExpenseTransaction } from "./../ExpenseTransaction";
import { Expense } from "./../Expense";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class UserSummary {
  @Field(() => Expense, { nullable: true })
  latestExpense: Expense | null;

  @Field(() => [ExpenseTransaction], { nullable: true })
  todaySpent: ExpenseTransaction[];

  @Field({ nullable: true })
  etfWorth: number;
  @Field({ nullable: true })
  etfMovement: number;

  @Field()
  savingValue: number;
}
