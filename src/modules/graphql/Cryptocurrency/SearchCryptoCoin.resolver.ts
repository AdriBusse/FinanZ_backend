import { CoinGeckoSearchCoin } from "./../../../entity/APITypes/CoinGeckoSearchCoin";
import { CoinGeckoAPI } from "./../../Services/CoinGeckoAPI";
import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../middleware/isAuth";

@Resolver(CoinGeckoSearchCoin)
export class SearchCryptoCoin {
  @Query(() => [CoinGeckoSearchCoin])
  @UseMiddleware(isAuth)
  async searchCryptoCoin(
    @Arg("query") query: string
  ): Promise<CoinGeckoSearchCoin[]> {
    const cur = await CoinGeckoAPI.searchCoin(query);
    if (!cur) {
      throw new Error("No Currencies found");
    }
    console.log("_________", cur);

    return cur;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
