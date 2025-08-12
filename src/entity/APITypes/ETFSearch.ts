import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ETFSearch {
  public constructor(init?: Partial<ETFSearch>) {
    Object.assign(this, init);
  }

  @Field()
  name: string;

  @Field()
  title: string;

  @Field()
  symbol: string;

  @Field()
  isin: string;

  @Field()
  wkn: string;
}
