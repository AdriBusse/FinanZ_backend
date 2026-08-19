import { Field, ObjectType } from "@nestjs/graphql";
import { Expense } from "../../expense/entities/expense.entity";
import { ExpenseTransaction } from "../../expense/entities/expense-transaction.entity";

@ObjectType()
export class UserSummary {
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

export default UserSummary;
