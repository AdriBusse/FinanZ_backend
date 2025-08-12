import { CoinGeckoAPI } from "./../../Services/CoinGeckoAPI";
import { Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../middleware/isAuth";

@Resolver(String)
export class getSupportedVsCurrencies {
  @Query(() => [String])
  @UseMiddleware(isAuth)
  async getSupportedVsCurrencies(): Promise<string[]> {
    const vs_cur = await CoinGeckoAPI.getSupportedVsCurrencies();
    if (!vs_cur) {
      throw new Error("No Currencies found");
    }
    return vs_cur;
  }
  catch(error: { message: string | undefined }) {
    console.log(error);
    throw new Error(error.message);
  }
}
