/** API: https://binance-docs.github.io/apidocs/spot/en/#exchange-information */
export interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters?: [];
  permissions: string[];
  defaultSelfTradePreventionMode: string;
  allowedSelfTradePreventionModes: string[];
}

/** API: https://binance-docs.github.io/apidocs/spot/en/#exchange-information */
export interface BinanceCoinsResponse {
  timezone: string;
  serverTime: number;
  rateLimits?: [];
  exchangeFilters?: [];
  symbols: BinanceSymbol[];
}
