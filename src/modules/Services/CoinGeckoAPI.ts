import { CoinGeckoGraphHistory } from "../../entity/APITypes/CoinGeckoGraphHistory";
import { CoinGeckoCoinDetails } from "./../../entity/APITypes/CoinGeckoCoinDetails";
import { CoinGeckoSearchCoin } from "./../../entity/APITypes/CoinGeckoSearchCoin";
import { CoinGeckoMarkets } from "./../../entity/APITypes/CoinGeckoMarkets";
import axios from "axios";
import { CoinGeckoCoinDetailsAPI } from "./../../entity/APITypes/CoinGeckoCoinDetailsAPI";

const GECKO_BASE = "https://api.coingecko.com/api/v3";

export class CoinGeckoAPI {
  static getMarketData = async (
    ids = "",
    vs_currency = "usd",
    order = "market_cap_desc",
    per_page = 100,
    page = 1,
    sparkline = false
  ): Promise<CoinGeckoMarkets[] | undefined> => {
    try {
      const res = await axios.get<CoinGeckoMarkets[]>(
        `${GECKO_BASE}/coins/markets`,
        {
          params: {
            ids,
            vs_currency,
            order,
            per_page,
            page,
            sparkline,
            price_change_percentage: "1h,24h,7d",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  static getSupportedVsCurrencies = async (): Promise<string[] | undefined> => {
    try {
      const res = await axios.get<string[]>(
        `${GECKO_BASE}/simple/supported_vs_currencies`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  static searchCoin = async (
    query: string
  ): Promise<CoinGeckoSearchCoin[] | undefined> => {
    try {
      const res = await axios.get<{ coins: CoinGeckoSearchCoin[] }>(
        `${GECKO_BASE}/search`,
        {
          params: {
            query,
          },
        }
      );
      return res.data.coins || [];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  static getCoinDetails = async (
    id: string,
    vs_currency: string
  ): Promise<CoinGeckoCoinDetails | undefined> => {
    try {
      const res = await axios.get<CoinGeckoCoinDetailsAPI>(
        `${GECKO_BASE}/coins/${id}`,
        {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: true,
          },
        }
      );
      let parsedOBJ = res.data;
      parsedOBJ.market_data.current_price =
        //@ts-ignore
        res.data.market_data.current_price[vs_currency];
      parsedOBJ.market_data.ath =
        //@ts-ignore
        res.data.market_data.ath[vs_currency];
      parsedOBJ.market_data.ath_change_percentage =
        //@ts-ignore
        res.data.market_data.ath_change_percentage[vs_currency];
      parsedOBJ.market_data.ath_date =
        //@ts-ignore
        res.data.market_data.ath_date[vs_currency];
      parsedOBJ.market_data.atl =
        //@ts-ignore
        res.data.market_data.atl[vs_currency];
      parsedOBJ.market_data.atl_change_percentage =
        //@ts-ignore
        res.data.market_data.atl_change_percentage[vs_currency];
      parsedOBJ.market_data.atl_date =
        //@ts-ignore
        res.data.market_data.atl_date[vs_currency];
      parsedOBJ.market_data.market_cap =
        //@ts-ignore
        res.data.market_data.market_cap[vs_currency];
      parsedOBJ.market_data.total_volume =
        //@ts-ignore
        res.data.market_data.total_volume[vs_currency];
      parsedOBJ.market_data.high_24h =
        //@ts-ignore
        res.data.market_data.high_24h[vs_currency];
      parsedOBJ.market_data.low_24h =
        //@ts-ignore
        res.data.market_data.low_24h[vs_currency];
      parsedOBJ.market_data.price_change_24h_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_24h_in_currency[vs_currency];
      parsedOBJ.market_data.price_change_percentage_1h_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_percentage_1h_in_currency[
          vs_currency
        ] || null;
      parsedOBJ.market_data.price_change_percentage_24h_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_percentage_24h_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_7d_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_percentage_7d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_14d_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_percentage_14d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_30d_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_percentage_30d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_60d_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_percentage_60d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_200d_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_percentage_200d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_1y_in_currency =
        //@ts-ignore
        res.data.market_data.price_change_percentage_1y_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.market_cap_change_24h_in_currency =
        //@ts-ignore
        res.data.market_data.market_cap_change_24h_in_currency[vs_currency];
      parsedOBJ.market_data.market_cap_change_percentage_24h_in_currency =
        //@ts-ignore
        res.data.market_data.market_cap_change_percentage_24h_in_currency[
          vs_currency
        ];
      //@ts-ignore
      return parsedOBJ;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  static getCoinHistory = async (
    id: string,
    vs_currency: string,
    days: number
  ) => {
    const res = await axios.get<CoinGeckoGraphHistory>(
      `${GECKO_BASE}/coins/${id}/market_chart`,
      {
        params: {
          vs_currency,
          days,
        },
      }
    );
    return res.data;
  };
}
