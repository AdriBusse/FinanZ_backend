import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Sparkline {
  @Field(() => [Number], { nullable: true })
  price?: number[];
}
