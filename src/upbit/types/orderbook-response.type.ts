import {
  UpbitOrderbookResponse,
  UpbitOrderbookUnit,
} from '../interfaces/orderbook-response.interface';

export type PartialUpbitOrderbookResponse = Omit<
  Partial<UpbitOrderbookResponse>,
  'orderbook_units'
> & { orderbook_units: Partial<UpbitOrderbookUnit>[] };
