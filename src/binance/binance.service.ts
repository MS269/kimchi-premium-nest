import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { BinanceCoinsResponse } from './interfaces/coin-response.interface';
import { BinanceOrderbookResponse } from './interfaces/orderbook-response.interface';

/** API: https://binance-docs.github.io/apidocs/spot/en */
@Injectable()
export class BinanceService {
  /** API: https://binance-docs.github.io/apidocs/spot/en/#exchange-information */
  async fetchAllCoins() {
    const { data } = await axios.get<BinanceCoinsResponse>(
      'https://api.binance.com/api/v3/exchangeInfo',
    );

    const filtered = data.symbols.filter(
      (coin) => coin.quoteAsset.toUpperCase() === 'USDT',
    );

    return filtered.map((coin) => ({
      baseAsset: coin.baseAsset,
      quoteAsset: coin.quoteAsset,
      warning: coin.status !== 'TRADING',
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
