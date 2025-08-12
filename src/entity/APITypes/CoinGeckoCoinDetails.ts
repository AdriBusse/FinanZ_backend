import { Field, ObjectType } from "type-graphql";
import { Sparkline } from "./CoinGeckoCoinSparkline";

@ObjectType()
export class CoinGeckoCoinDetails {
  public constructor(init?: Partial<CoinGeckoCoinDetails>) {
    Object.assign(this, init);
  }
  @Field()
  id: string;

  @Field()
  symbol: string;

  @Field()
  name: string;

  @Field()
  block_time_in_minutes: number;

  @Field({ nullable: true })
  hashing_algorithm: string;

  @Field(() => [String])
  categories: string[];

  @Field(() => Describtion)
  description: {
    en: string;
  };

  @Field(() => Images)
  image: {
    thumb: string;
    small: string;
    large: string;
  };

  @Field({ nullable: true })
  genesis_date: string;

  @Field({ nullable: true })
  market_cap_rank: number;

  @Field(() => MarketData)
  market_data: {
    current_price: number;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    market_cap: number;

    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    price_change_24h_in_currency: number;
    price_change_percentage_1h_in_currency?: number;
    price_change_percentage_24h_in_currency?: number;
    price_change_percentage_7d_in_currency?: number;
    price_change_percentage_14d_in_currency?: number;
    price_change_percentage_30d_in_currency?: number;
    price_change_percentage_60d_in_currency?: number;
    price_change_percentage_200d_in_currency?: number;
    price_change_percentage_1y_in_currency?: number;
    market_cap_change_24h_in_currency?: number;
    market_cap_change_percentage_24h_in_currency?: number;
    total_supply: number | null;
    max_supply: number | null;
    circulating_supply: number;
    sparkline_7d: Sparkline;
    last_updated: string;
  };
}

@ObjectType()
class MarketData {
  @Field()
  current_price: number;

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
  market_cap: number;

  @Field()
  market_cap_rank: number;

  @Field()
  total_volume: number;

  @Field()
  high_24h: number;

  @Field()
  low_24h: number;

  @Field()
  price_change_percentage_24h: number;

  @Field()
  price_change_percentage_7d: number;

  @Field()
  price_change_percentage_14d: number;

  @Field()
  price_change_percentage_30d: number;

  @Field()
  price_change_percentage_60d: number;

  @Field()
  price_change_percentage_200d: number;

  @Field()
  price_change_percentage_1y: number;

  @Field()
  market_cap_change_24h: number;

  @Field()
  market_cap_change_percentage_24h: number;

  @Field()
  price_change_24h_in_currency: number;

  @Field({ nullable: true })
  price_change_percentage_1h_in_currency?: number;

  @Field()
  price_change_percentage_24h_in_currency: number;

  @Field()
  price_change_percentage_7d_in_currency: number;

  @Field()
  price_change_percentage_14d_in_currency: number;

  @Field()
  price_change_percentage_30d_in_currency: number;

  @Field()
  price_change_percentage_60d_in_currency: number;

  @Field()
  price_change_percentage_200d_in_currency: number;

  @Field()
  price_change_percentage_1y_in_currency: number;

  @Field()
  market_cap_change_24h_in_currency: number;

  @Field()
  market_cap_change_percentage_24h_in_currency: number;

  @Field({ nullable: true })
  total_supply: number;

  @Field({ nullable: true })
  max_supply: number;

  @Field()
  circulating_supply: number;

  @Field(() => Sparkline)
  sparkline_7d: Sparkline;

  @Field()
  last_updated: string;
}

@ObjectType()
class Describtion {
  @Field()
  en: string;
}

@ObjectType()
class Images {
  @Field()
  thumb: string;
  @Field()
  small: string;
  @Field()
  large: string;
}
