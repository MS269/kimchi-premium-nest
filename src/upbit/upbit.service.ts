import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { Coin } from '../coin/entities/coin.entity';
import { Price } from '../price/entities/price.entity';
import { UpbitCoinResponse } from './interfaces/coin-response.interface';
import { UpbitOrderbookResponse } from './interfaces/orderbook-response.interface';
import { UpbitPriceResponse } from './interfaces/price-response.interface';

/** API: https://docs.upbit.com/reference */
@Injectable()
export class UpbitService {
  private readonly logger = new Logger(UpbitService.name);

  /** API: https://docs.upbit.com/reference/%EB%A7%88%EC%BC%93-%EC%BD%94%EB%93%9C-%EC%A1%B0%ED%9A%8C */
  async fetchAllCoins() {
    try {
      const { data } = await axios.get<UpbitCoinResponse[]>(
        'https://api.upbit.com/v1/market/all',
        { params: { isDetails: true } },
      );

      const filtered = data.filter((coin) =>
        coin.market.toUpperCase().startsWith('KRW'),
      );

      return filtered.map(
        (coin) =>
          ({
            exchangeName: 'Upbit',
            name: coin.english_name,
            symbol: coin.market.toUpperCase(),
            baseAsset: coin.market.split('-')[1].toUpperCase(),
            quoteAsset: coin.market.split('-')[0].toUpperCase(),
            warning: coin.market_warning !== 'NONE' ? coin.market_warning : '',
          } satisfies Partial<Coin>),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  /** API: https://docs.upbit.com/reference/ticker%ED%98%84%EC%9E%AC%EA%B0%80-%EC%A0%95%EB%B3%B4 */
  async fetchPrices(symbols: string[]) {
    try {
      if (symbols.length === 0) {
        return [];
      }

      const { data } = await axios.get<UpbitPriceResponse[]>(
        'https://api.upbit.com/v1/ticker',
        { params: { markets: symbols.join(', ') } },
      );

      return data.map(
        (price) =>
          ({
            exchangeName: 'Upbit' as string,
            symbol: price.market,
            krw: price.trade_price,
            timestamp: new Date(price.timestamp),
          } satisfies Partial<Coin & Price>),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  /** API: https://docs.upbit.com/reference/%ED%98%B8%EA%B0%80-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C */
  async fetchOrderbooks(symbols: string[]) {
    try {
      if (symbols.length === 0) {
        return [];
      }

      const { data } = await axios.get<UpbitOrderbookResponse[]>(
        `https://api.upbit.com/v1/orderbook?markets=${symbols.join(
          '&markets=',
        )}`,
      );

      // TODO
      return data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
