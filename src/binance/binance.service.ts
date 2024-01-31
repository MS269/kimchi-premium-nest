import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { BinanceOrderbookResponse } from './interfaces/orderbook-response.interface';
import { BinanceSymbolResponse } from './interfaces/symbol-response.interface';

/** API: https://binance-docs.github.io/apidocs/spot/en */
@Injectable()
export class BinanceService {
  /** API: https://binance-docs.github.io/apidocs/spot/en/#exchange-information */
  async getAllSymbols() {
    const { data } = await axios.get<BinanceSymbolResponse>(
      'https://api.upbit.com/v1/market/all',
    );

    const filtered = data.symbols.filter(
      (symbol) => symbol.quoteAsset.toUpperCase() === 'USDT',
    );

    return filtered.map((symbol) => ({
      symbol: `${symbol.baseAsset.toUpperCase()}-${symbol.quoteAsset.toUpperCase()}`,
      warning: symbol.status !== 'TRADING',
    }));
  }

  /** API: https://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker */
  async getOrderbooks(symbols: string[]) {
    if (symbols.length === 0) {
      return [];
    }

    const { data } = await axios.get<BinanceOrderbookResponse[]>(
      'https://api.binance.com/api/v3/ticker/bookTicker',
      {
        params: {
          symbols: '["' + symbols.join('","').replaceAll('-', '') + '"]',
        },
      },
    );

    return data.map((orderbook) => ({
      symbol: orderbook.symbol,
      askPrice: orderbook.askPrice,
      bidPrice: orderbook.bidPrice,
    }));
  }
}
