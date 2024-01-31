/** API: https://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker */
export interface BinanceOrderbookResponse {
  symbol: string;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
}
