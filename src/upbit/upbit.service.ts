import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { UpbitCoinResponse } from './interfaces/coin-response.interface';
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

      return filtered.map((coin) => ({
        exchange: 'Upbit',
        name: coin.english_name,
        symbol: coin.market.toUpperCase(),
        baseAsset: coin.market.split('-')[1].toUpperCase(),
        quoteAsset: coin.market.split('-')[0].toUpperCase(),
        warning: coin.market_warning !== 'NONE' ? coin.market_warning : '',
      }));
    } catch (error) {
      this.logger.error(error);
    }
  }

  /** API: https://docs.upbit.com/reference/%ED%98%B8%EA%B0%80-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C */
  async fetchPrices(symbols: string[]) {
    try {
      if (symbols.length === 0) {
        return [];
      }

      const { data } = await axios.get<UpbitPriceResponse[]>(
        `https://api.upbit.com/v1/orderbook?markets=${symbols.join(
          '&markets=',
        )}`,
      );

      return data.map((orderbook) => ({
        exchange: 'Upbit',
        symbol: orderbook.market.toUpperCase(),
        bidPrice: orderbook.orderbook_units[0].bid_price,
        askPrice: orderbook.orderbook_units[0].ask_price,
      }));
    } catch (error) {
      this.logger.error(error);
    }
  }
}
