import { Field, Float, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CategoryScoreType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Float)
  score!: number;
}

@ObjectType()
export class CategorizeExpenseResultType {
  @Field(() => CategoryScoreType, { nullable: true })
  best?: CategoryScoreType;

  @Field(() => [CategoryScoreType])
  candidates!: CategoryScoreType[];
}
