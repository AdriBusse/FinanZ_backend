import { Injectable } from "@nestjs/common";
import axios from "axios";
import { CoinGeckoMarkets } from "../types/coingecko-markets.type";
import { CoinGeckoSearchCoin } from "../types/coingecko-search-coin.type";
import { CoinGeckoCoinDetails } from "../types/coingecko-coin-details.type";
import { CoinGeckoGraphHistory } from "../types/coingecko-graph-history.type";

@Injectable()
export class CoinGeckoApiService {
  private readonly GECKO_BASE = "https://api.coingecko.com/api/v3";

  async getMarketData(
    ids = "",
    vs_currency = "usd",
    order = "market_cap_desc",
    per_page = 100,
    page = 1,
    sparkline = false
  ): Promise<CoinGeckoMarkets[] | undefined> {
    try {
      const res = await axios.get<CoinGeckoMarkets[]>(
        `${this.GECKO_BASE}/coins/markets`,
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
  }

  async getSupportedVsCurrencies(): Promise<string[] | undefined> {
    try {
      const res = await axios.get<string[]>(
        `${this.GECKO_BASE}/simple/supported_vs_currencies`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async searchCoin(query: string): Promise<CoinGeckoSearchCoin[] | undefined> {
    try {
      const res = await axios.get<{ coins: CoinGeckoSearchCoin[] }>(
        `${this.GECKO_BASE}/search`,
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
  }

  async getCoinDetails(
    id: string,
    vs_currency: string
  ): Promise<CoinGeckoCoinDetails | undefined> {
    try {
      const res = await axios.get<any>(`${this.GECKO_BASE}/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true,
        },
      });

      const parsedOBJ = res.data;
      parsedOBJ.market_data.current_price =
        res.data.market_data.current_price[vs_currency];
      parsedOBJ.market_data.ath = res.data.market_data.ath[vs_currency];
      parsedOBJ.market_data.ath_change_percentage =
        res.data.market_data.ath_change_percentage[vs_currency];
      parsedOBJ.market_data.ath_date =
        res.data.market_data.ath_date[vs_currency];
      parsedOBJ.market_data.atl = res.data.market_data.atl[vs_currency];
      parsedOBJ.market_data.atl_change_percentage =
        res.data.market_data.atl_change_percentage[vs_currency];
      parsedOBJ.market_data.atl_date =
        res.data.market_data.atl_date[vs_currency];
      parsedOBJ.market_data.market_cap =
        res.data.market_data.market_cap[vs_currency];
      parsedOBJ.market_data.total_volume =
        res.data.market_data.total_volume[vs_currency];
      parsedOBJ.market_data.high_24h =
        res.data.market_data.high_24h[vs_currency];
      parsedOBJ.market_data.low_24h =
        res.data.market_data.low_24h[vs_currency];
      parsedOBJ.market_data.price_change_24h_in_currency =
        res.data.market_data.price_change_24h_in_currency[vs_currency];
      parsedOBJ.market_data.price_change_percentage_1h_in_currency =
        res.data.market_data.price_change_percentage_1h_in_currency[
          vs_currency
        ] || null;
      parsedOBJ.market_data.price_change_percentage_24h_in_currency =
        res.data.market_data.price_change_percentage_24h_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_7d_in_currency =
        res.data.market_data.price_change_percentage_7d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_14d_in_currency =
        res.data.market_data.price_change_percentage_14d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_30d_in_currency =
        res.data.market_data.price_change_percentage_30d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_60d_in_currency =
        res.data.market_data.price_change_percentage_60d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_200d_in_currency =
        res.data.market_data.price_change_percentage_200d_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.price_change_percentage_1y_in_currency =
        res.data.market_data.price_change_percentage_1y_in_currency[
          vs_currency
        ];
      parsedOBJ.market_data.market_cap_change_24h_in_currency =
        res.data.market_data.market_cap_change_24h_in_currency[vs_currency];
      parsedOBJ.market_data.market_cap_change_percentage_24h_in_currency =
        res.data.market_data.market_cap_change_percentage_24h_in_currency[
          vs_currency
        ];

      return parsedOBJ;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getCoinHistory(
    id: string,
    vs_currency: string,
    days: number
  ): Promise<CoinGeckoGraphHistory | undefined> {
    try {
      const res = await axios.get<CoinGeckoGraphHistory>(
        `${this.GECKO_BASE}/coins/${id}/market_chart`,
        {
          params: {
            vs_currency,
            days,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
}

export const CoinGeckoAPI = new CoinGeckoApiService();
