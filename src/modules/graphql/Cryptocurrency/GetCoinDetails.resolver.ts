import { CoinGeckoCoinDetails } from "./../../../entity/APITypes/CoinGeckoCoinDetails";
import { CoinGeckoAPI } from "./../../Services/CoinGeckoAPI";
import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../middleware/isAuth";

@Resolver(CoinGeckoCoinDetails)
export class GetCoinDetails {
  @Query(() => CoinGeckoCoinDetails, { nullable: true })
  @UseMiddleware(isAuth)
  async getCoinDetails(
    @Arg("id", { nullable: true }) id: string,
    @Arg("vs_currency") vs_currency: string
  ): Promise<CoinGeckoCoinDetails> {
    const marketData = await CoinGeckoAPI.getCoinDetails(id, vs_currency);
    if (!marketData) {
      throw new Error("No details data found");
    }
    return marketData;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
