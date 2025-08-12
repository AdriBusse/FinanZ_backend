import { Field, ObjectType } from "type-graphql";
import { Sparkline } from "./CoinGeckoCoinSparkline";

@ObjectType()
export class CoinGeckoMarkets {
  public constructor(init?: Partial<CoinGeckoMarkets>) {
    Object.assign(this, init);
  }

  @Field()
  id: string;

  @Field()
  symbol: string;

  @Field()
  name: string;

  @Field()
  image: string;

  @Field()
  current_price: number;

  @Field()
  market_cap: number;

  @Field({ nullable: true })
  market_cap_rank: number;

  @Field()
  fully_diluted_valuation: number;

  @Field()
  total_volume: number;

  @Field()
  high_24h: number;

  @Field()
  low_24h: number;

  @Field({ nullable: true })
  price_change_percentage_1h_in_currency?: number;

  @Field()
  price_change_24h: number;

  @Field({ nullable: true })
  price_change_percentage_7d_in_currency?: number;

  @Field({ nullable: true })
  price_change_percentage_24h?: number;

  @Field({ nullable: true })
  market_cap_change_24h?: number;

  @Field({ nullable: true })
  market_cap_change_percentage_24h?: number;

  @Field()
  circulating_supply: number;

  @Field()
  total_supply: number;

  @Field()
  max_supply: number;

  @Field()
  ath: number;

  @Field()
  ath_change_percentage: number;

  @Field()
  ath_date: string;

  @Field()
  atl: number;

  @Field()
  atl_change_percentage: number;

  @Field()
  atl_date: string;

  @Field()
  last_updated: string;

  @Field(() => Sparkline, { nullable: true })
  sparkline_in_7d?: Sparkline;
}
