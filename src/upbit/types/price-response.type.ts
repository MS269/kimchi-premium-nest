import {
  UpbitOrderbookUnit,
  UpbitPriceResponse,
} from '../interfaces/price-response.interface';

export type PartialUpbitPriceResponse = Omit<
  Partial<UpbitPriceResponse>,
  'orderbook_units'
> & { orderbook_units: Partial<UpbitOrderbookUnit>[] };
