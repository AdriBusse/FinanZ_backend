import { Resolver, Query, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { CoinGeckoApiService } from "../services/coingecko-api.service";
import { CoinGeckoMarkets } from "../types/coingecko-markets.type";
import { CoinGeckoSearchCoin } from "../types/coingecko-search-coin.type";
import { CoinGeckoCoinDetails } from "../types/coingecko-coin-details.type";
import { CoinGeckoGraphHistory } from "../types/coingecko-graph-history.type";
import { GqlAuthGuard } from "../../common/guards/gql-auth.guard";

@Resolver()
export class CryptoResolver {
  constructor(private readonly coingeckoService: CoinGeckoApiService) {}

  @Query(() => [CoinGeckoMarkets])
  @UseGuards(GqlAuthGuard)
  async getMarketData(
    @Args("vs_currency") vs_currency: string,
    @Args("ids", { nullable: true }) ids?: string
  ): Promise<CoinGeckoMarkets[]> {
    const res = await this.coingeckoService.getMarketData(
      ids,
      vs_currency,
      "market_cap_desc",
      100,
      1,
      true
    );
    return res || [];
  }

  @Query(() => [String])
  @UseGuards(GqlAuthGuard)
  async getSupportedVsCurrencies(): Promise<string[]> {
    const res = await this.coingeckoService.getSupportedVsCurrencies();
    return res || [];
  }

  @Query(() => [CoinGeckoSearchCoin])
  @UseGuards(GqlAuthGuard)
  async searchCryptoCoin(
    @Args("query") query: string
  ): Promise<CoinGeckoSearchCoin[]> {
    const res = await this.coingeckoService.searchCoin(query);
    return res || [];
  }

  @Query(() => CoinGeckoCoinDetails, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getCoinDetails(
    @Args("id") id: string,
    @Args("vs_currency", { nullable: true, defaultValue: "usd" })
    vs_currency: string
  ): Promise<CoinGeckoCoinDetails | null> {
    const res = await this.coingeckoService.getCoinDetails(id, vs_currency);
    return res || null;
  }

  @Query(() => CoinGeckoGraphHistory, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getCoinGraphHistory(
    @Args("id") id: string,
    @Args("days") days: string,
    @Args("vs_currency") vs_currency: string
  ): Promise<CoinGeckoGraphHistory | null> {
    const res = await this.coingeckoService.getCoinHistory(
      id,
      vs_currency,
      Number(days)
    );
    return res || null;
  }
}
