import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class ExpenseByCategory {
  @Field()
  name: string;

  @Field()
  amount: number;

  @Field()
  icon: string;

  @Field()
  color: string;
}
