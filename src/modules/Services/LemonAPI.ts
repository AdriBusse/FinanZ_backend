import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../../.env" });

const LEMON_BASE = "https://data.lemon.markets/v1/";
const TOKEN = process.env.LEMON_SECRET;

export class LemonAPI {
  static searchETF = async (
    search?: string
  ): Promise<ETFResult | undefined> => {
    try {
      const res = await axios.get<SearchResponse>(
        `${LEMON_BASE}/instruments?search=${search}`,
        {
          headers: {
            Authorization: "Bearer " + TOKEN,
          },
        }
      );
      return res.data.results[0];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  static lastQuotes = async (
    isin: string
  ): Promise<QuoteResult | undefined> => {
    try {
      const res = await axios.get<QuoteResponse>(
        `${LEMON_BASE}/quotes/latest?isin=${isin}`,
        {
          headers: {
            Authorization: "Bearer " + TOKEN,
          },
        }
      );
      return res.data.results[0];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  static getETFWorth = async (
    isin: string,
    amount: number
  ): Promise<number> => {
    try {
      const res = await this.lastQuotes(isin);
      if (!res) {
        throw new Error("Something went wrong while getting the ETF worth");
      }

      return parseFloat((amount * res.a).toFixed(2));
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
}
interface QuoteResponse {
  time: string;
  results: QuoteResult[];
}

interface QuoteResult {
  isin: string;
  b_v: number;
  a_v: number;
  b: number;
  a: number;
  t: string;
  mic: string;
}
interface SearchResponse {
  time: string;
  results: ETFResult[];
}
interface ETFResult {
  isin: string;
  wkn: string;
  name: string;
  title: string;
  symbol: string;
  type: string;
  venue: {
    name: string;
    title: string;
    mic: string;
    is_open: boolean;
    tradable: boolean;
    currency: string;
  };
}
