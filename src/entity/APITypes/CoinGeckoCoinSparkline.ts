import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Sparkline {
  @Field(() => [Number], { nullable: true })
  price: number[];
}
