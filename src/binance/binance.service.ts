import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { Coin } from '../coin/entities/coin.entity';
import { Price } from '../price/entities/price.entity';
import { BinanceCoinsResponse } from './interfaces/coin-response.interface';
import { BinanceOrderbookResponse } from './interfaces/orderbook-response.interface';
import { BinancePriceResponse } from './interfaces/price-response.interface';

/** API: https://binance-docs.github.io/apidocs/spot/en */
@Injectable()
export class BinanceService {
  private readonly logger = new Logger(BinanceService.name);

  /** API: https://binance-docs.github.io/apidocs/spot/en/#exchange-information */
  async fetchAllCoins() {
    try {
      const { data } = await axios.get<BinanceCoinsResponse>(
        'https://api.binance.com/api/v3/exchangeInfo',
      );

      const filtered = data.symbols.filter(
        (coin) => coin.quoteAsset.toUpperCase() === 'USDT',
      );

      return filtered.map(
        (coin) =>
          ({
            exchangeName: 'Binance',
            symbol: coin.symbol.toUpperCase(),
            baseAsset: coin.baseAsset.toUpperCase(),
            quoteAsset: coin.quoteAsset.toUpperCase(),
            warning: coin.status !== 'TRADING' ? coin.status : '',
          } satisfies Partial<Coin>),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  /** API: https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker */
  async fetchPrices(symbols: string[]) {
    try {
      const { data } = await axios.get<BinancePriceResponse[]>(
        'https://api.binance.com/api/v3/ticker/price',
        { params: { symbols: '["' + symbols.join('","') + '"]' } },
      );

      return data.map(
        (price) =>
          ({
            exchangeName: 'Binance',
            symbol: price.symbol,
            usdt: price.price,
            timestamp: new Date(),
          } satisfies Partial<Coin & Price>),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  /** API: https://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker */
  async fetchOrderbooks(symbols: string[]) {
    try {
      if (symbols.length === 0) {
        return [];
      }

      const { data } = await axios.get<BinanceOrderbookResponse[]>(
        'https://api.binance.com/api/v3/ticker/bookTicker',
        { params: { symbols: '["' + symbols.join('","') + '"]' } },
      );

      // TODO
      return data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
