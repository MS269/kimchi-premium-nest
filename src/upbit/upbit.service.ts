import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { UpbitOrderbookResponse } from './interfaces/orderbook-response.interface';

/** API: https://docs.upbit.com/reference */
@Injectable()
export class UpbitService {
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