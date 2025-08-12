import { CoinGeckoAPI } from "./../../Services/CoinGeckoAPI";
import { CoinGeckoMarkets } from "./../../../entity/APITypes/CoinGeckoMarkets";
import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../middleware/isAuth";

@Resolver(CoinGeckoMarkets)
export class GetMarketData {
  @Query(() => [CoinGeckoMarkets], { nullable: true })
  @UseMiddleware(isAuth)
  async getMarketData(
    @Arg("ids", { nullable: true }) ids: string,
    @Arg("vs_currency", { defaultValue: "usd" }) vs_currency: string,
    @Arg("order", { defaultValue: "market_cap_desc" }) order: string,
    @Arg("per_page", { defaultValue: 10 }) per_page: number,
    @Arg("page", { defaultValue: 1 }) page: number,
    @Arg("sparkline", { defaultValue: false }) sparkline: boolean
  ): Promise<CoinGeckoMarkets[]> {
    const marketData = await CoinGeckoAPI.getMarketData(
      ids,
      vs_currency,
      order,
      per_page,
      page,
      sparkline
    );
    if (!marketData) {
      throw new Error("No market data found");
    }
    return marketData;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
