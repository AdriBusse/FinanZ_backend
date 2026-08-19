import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class VoiceExpenseResult {
  @Field()
  id: string;

  @Field()
  transcription: string;

  @Field()
  title: string;

  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  suggestedCategoryId?: string;

  @Field({ nullable: true })
  suggestedCategoryName?: string;
}
