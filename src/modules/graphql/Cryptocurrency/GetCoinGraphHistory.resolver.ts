import { CoinGeckoGraphHistory } from "../../../entity/APITypes/CoinGeckoGraphHistory";
import { CoinGeckoAPI } from "./../../Services/CoinGeckoAPI";
import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../middleware/isAuth";

@Resolver(CoinGeckoGraphHistory)
export class GetCoinGraphHistory {
  @Query(() => CoinGeckoGraphHistory, { nullable: true })
  @UseMiddleware(isAuth)
  async getCoinGraphHistory(
    @Arg("id") id: string,
    @Arg("vs_currency") vs_currency: string,
    @Arg("days") days: number
  ): Promise<CoinGeckoGraphHistory> {
    const coinGraph = await CoinGeckoAPI.getCoinHistory(id, vs_currency, days);
    if (!coinGraph) {
      throw new Error("No graph data found");
    }
    return coinGraph;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
