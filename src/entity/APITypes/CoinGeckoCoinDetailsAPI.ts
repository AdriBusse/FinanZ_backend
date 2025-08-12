import { Sparkline } from "./CoinGeckoCoinSparkline";

export class CoinGeckoCoinDetailsAPI {
  public constructor(init?: Partial<CoinGeckoCoinDetailsAPI>) {
    Object.assign(this, init);
  }
  id: string;

  symbol: string;

  name: string;

  block_time_in_minutes: number;

  hashing_algorithm: string;

  categories: string[];

  description: {
    en: string;
  };

  image: {
    thumb: string;
    small: string;
    large: string;
  };

  genesis_date: string;

  market_cap_rank: number;

  market_data: {
    current_price: CoinGeckoCurrencyInformationNumber;
    ath: CoinGeckoCurrencyInformationNumber;
    ath_change_percentage: CoinGeckoCurrencyInformationNumber;
    ath_date: CoinGeckoCurrencyInformationString;
    atl: CoinGeckoCurrencyInformationNumber;
    atl_change_percentage: CoinGeckoCurrencyInformationNumber;
    atl_date: CoinGeckoCurrencyInformationString;
    market_cap: CoinGeckoCurrencyInformationNumber;
    market_cap_rank: number;

    total_volume: CoinGeckoCurrencyInformationNumber;
    high_24h: CoinGeckoCurrencyInformationNumber;
    low_24h: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    price_change_24h_in_currency: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_1h_in_currency?: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_24h_in_currency?: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_7d_in_currency?: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_14d_in_currency?: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_30d_in_currency?: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_60d_in_currency?: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_200d_in_currency?: CoinGeckoCurrencyInformationNumber;
    price_change_percentage_1y_in_currency?: CoinGeckoCurrencyInformationNumber;
    market_cap_change_24h_in_currency?: CoinGeckoCurrencyInformationNumber;
    market_cap_change_percentage_24h_in_currency?: CoinGeckoCurrencyInformationNumber;
    total_supply: number;
    max_supply: number;
    circulating_supply: number;
    sparkline_7d: Sparkline;
    last_updated: string;
  };
}
class CoinGeckoCurrencyInformationNumber {
  aed: number;
  ars: number;
  aud: number;
  bch: number;
  bdt: number;
  bhd: number;
  bmd: number;
  bnb: number;
  brl: number;
  btc: number;
  cad: number;
  chf: number;
  clp: number;
  cny: number;
  czk: number;
  dkk: number;
  dot: number;
  eos: number;
  eth: number;
  eur: number;
  gbp: number;
  hkd: number;
  huf: number;
  idr: number;
  ils: number;
  inr: number;
  jpy: number;
  krw: number;
  kwd: number;
  lkr: number;
  ltc: number;
  mmk: number;
  mxn: number;
  myr: number;
  ngn: number;
  nok: number;
  nzd: number;
  php: number;
  pkr: number;
  pln: number;
  rub: number;
  sar: number;
  sek: number;
  sgd: number;
  thb: number;
  try: number;
  twd: number;
  uah: number;
  usd: number;
  vef: number;
  vnd: number;
  xag: number;
  xau: number;
  xdr: number;
  xlm: number;
  xrp: number;
  yfi: number;
  zar: number;
  bits: number;
  link: number;
  sats: number;
}
class CoinGeckoCurrencyInformationString {
  aed: string;
  ars: string;
  aud: string;
  bch: string;
  bdt: string;
  bhd: string;
  bmd: string;
  bnb: string;
  brl: string;
  btc: string;
  cad: string;
  chf: string;
  clp: string;
  cny: string;
  czk: string;
  dkk: string;
  dot: string;
  eos: string;
  eth: string;
  eur: string;
  gbp: string;
  hkd: string;
  huf: string;
  idr: string;
  ils: string;
  inr: string;
  jpy: string;
  krw: string;
  kwd: string;
  lkr: string;
  ltc: string;
  mmk: string;
  mxn: string;
  myr: string;
  ngn: string;
  nok: string;
  nzd: string;
  php: string;
  pkr: string;
  pln: string;
  rub: string;
  sar: string;
  sek: string;
  sgd: string;
  thb: string;
  try: string;
  twd: string;
  uah: string;
  usd: string;
  vef: string;
  vnd: string;
  xag: string;
  xau: string;
  xdr: string;
  xlm: string;
  xrp: string;
  yfi: string;
  zar: string;
  bits: string;
  link: string;
  sats: string;
}
