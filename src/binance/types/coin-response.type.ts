import {
  BinanceCoinsResponse,
  BinanceSymbol,
} from '../interfaces/coin-response.interface';

export type PartialBinanceCoinsResponse = Omit<
  Partial<BinanceCoinsResponse>,
  'symbols'
> & { symbols: Partial<BinanceSymbol>[] };
