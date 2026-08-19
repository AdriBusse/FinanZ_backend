import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ExpenseByCategory {
  @Field()
  name: string;

  @Field()
  amount: number;

  @Field()
  icon: string;

  @Field()
  color: string;
}

export default ExpenseByCategory;
