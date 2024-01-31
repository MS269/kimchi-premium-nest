import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { BinanceOrderbookResponse } from './interfaces/orderbook-response.interface';

/** API: https://binance-docs.github.io/apidocs/spot/en */
@Injectable()
export class BinanceService {
  /** API: https://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker */
  async getOrderbooks(symbols: string[]) {
    if (symbols.length === 0) {
      return [];
    }

    const { data } = await axios.get<BinanceOrderbookResponse[]>(
      'https://api.binance.com/api/v3/ticker/bookTicker',
      { params: { symbols: '["' + symbols.join('","') + '"]' } },
    );

    return data.map((orderbook) => ({
      symbol: orderbook.symbol,
      askPrice: orderbook.askPrice,
      bidPrice: orderbook.bidPrice,
    }));
  }
}
