import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { BinanceCoinsResponse } from './interfaces/coin-response.interface';
import { BinancePriceResponse } from './interfaces/price-response.interface';

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
      exchange: 'Binance',
      symbol: coin.symbol.toUpperCase(),
      baseAsset: coin.baseAsset.toUpperCase(),
      quoteAsset: coin.quoteAsset.toUpperCase(),
      warning: coin.status !== 'TRADING',
      message: coin.status !== 'TRADING' ? coin.status : '',
    }));
  }

  /** API: https://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker */
  async fetchPrices(symbols: string[]) {
    if (symbols.length === 0) {
      return [];
    }

    const { data } = await axios.get<BinancePriceResponse[]>(
      'https://api.binance.com/api/v3/ticker/bookTicker',
      { params: { symbols: '["' + symbols.join('","') + '"]' } },
    );

    return data.map((orderbook) => ({
      exchange: 'Binance',
      symbol: orderbook.symbol.toUpperCase(),
      askPrice: orderbook.askPrice,
      bidPrice: orderbook.bidPrice,
    }));
  }
}
