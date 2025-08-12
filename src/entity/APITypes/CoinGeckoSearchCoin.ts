import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class CoinGeckoSearchCoin {
  public constructor(init?: Partial<CoinGeckoSearchCoin>) {
    Object.assign(this, init);
  }

  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  symbol: string;

  @Field()
  api_symbol: string;

  @Field({ nullable: true })
  market_cap_rank: number;

  @Field()
  thumb: string;

  @Field()
  large: string;
}
