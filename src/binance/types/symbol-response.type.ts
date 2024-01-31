import {
  BinanceSymbol,
  BinanceSymbolResponse,
} from '../interfaces/symbol-response.interface';

export type PartialBinanceSymbolResponse = Omit<
  Partial<BinanceSymbolResponse>,
  'symbols'
> & { symbols: Partial<BinanceSymbol>[] };
