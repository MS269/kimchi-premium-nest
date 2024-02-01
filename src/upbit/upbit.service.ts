import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { UpbitCoinResponse } from './interfaces/coin-response.interface';
import { UpbitOrderbookResponse } from './interfaces/orderbook-response.interface';

/** API: https://docs.upbit.com/reference */
@Injectable()
export class UpbitService {
  /** API: https://docs.upbit.com/reference/%EB%A7%88%EC%BC%93-%EC%BD%94%EB%93%9C-%EC%A1%B0%ED%9A%8C */
  async fetchAllCoins() {
    const { data } = await axios.get<UpbitCoinResponse[]>(
      'https://api.upbit.com/v1/market/all',
      { params: { isDetails: true } },
    );

    const filtered = data.filter((coin) =>
      coin.market.toUpperCase().startsWith('KRW'),
    );

    return filtered.map((coin) => ({
      name: coin.english_name,
      baseAsset: coin.market.split('-')[0],
      quoteAsset: coin.market.split('-')[1],
      warning: coin.market_warning !== 'NONE',
    }));
  }

  /** API: https://docs.upbit.com/reference/%ED%98%B8%EA%B0%80-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C */
  async getOrderbooks(symbols: string[]) {
    if (symbols.length === 0) {
      return [];
    }

    const { data } = await axios.get<UpbitOrderbookResponse[]>(
      'https://api.upbit.com/v1/orderbook',
      { params: { markets: symbols.join('&markets=') } },
    );

    return data.map((orderbook) => ({
      symbol: orderbook.market,
      askPrice: orderbook.orderbook_units[0].ask_price,
      bidPrice: orderbook.orderbook_units[0].bid_price,
    }));
  }
}
