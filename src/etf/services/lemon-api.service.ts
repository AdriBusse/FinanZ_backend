import { Injectable } from "@nestjs/common";
import axios from "axios";

export interface QuoteResult {
  isin: string;
  b_v: number;
  a_v: number;
  b: number;
  a: number;
  t: string;
  mic: string;
}

export interface QuoteResponse {
  time: string;
  results: QuoteResult[];
}

export interface ETFResult {
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

export interface SearchResponse {
  time: string;
  results: ETFResult[];
}

@Injectable()
export class LemonApiService {
  private readonly LEMON_BASE = "https://data.lemon.markets/v1/";

  private getToken(): string | undefined {
    return process.env.LEMON_SECRET;
  }

  async searchETF(search?: string): Promise<ETFResult | undefined> {
    try {
      const token = this.getToken();
      const res = await axios.get<SearchResponse>(
        `${this.LEMON_BASE}/instruments?search=${search}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data.results[0];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async lastQuotes(isin: string): Promise<QuoteResult | undefined> {
    try {
      const token = this.getToken();
      const res = await axios.get<QuoteResponse>(
        `${this.LEMON_BASE}/quotes/latest?isin=${isin}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data.results[0];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getETFWorth(isin: string, amount: number): Promise<number> {
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
  }
}

export const LemonAPI = new LemonApiService();
