import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class CoinGeckoGraphHistory {
  public constructor(init?: Partial<CoinGeckoGraphHistory>) {
    Object.assign(this, init);
  }
  @Field(() => [[Number]])
  prices: number[][];

  @Field(() => [[Number]])
  market_caps: number[][];

  @Field(() => [[Number]])
  total_volumes: number[][];
}
