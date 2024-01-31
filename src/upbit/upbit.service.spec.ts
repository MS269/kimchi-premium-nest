import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { UpbitOrderbookResponse } from './interfaces/orderbook-response.interface';
import { UpbitService } from './upbit.service';

jest.mock('axios');

describe('UpbitService', () => {
  let service: UpbitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpbitService],
    }).compile();

    service = module.get<UpbitService>(UpbitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrderbooks()', () => {
    it('should return 1 orderbook with 1 symbol', async () => {
      // given
      const symbols = ['KRW-BTC'];

      const res: UpbitOrderbookResponse[] = [
        {
          market: 'KRW-BTC',
          timestamp: 1706687128273,
          total_ask_size: 3.07995955,
          total_bid_size: 1.08417531,
          orderbook_units: [
            {
              ask_price: 59101000,
              bid_price: 59100000,
              ask_size: 0.13759379,
              bid_size: 0.03418226,
            },
          ],
          level: 0,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const orderbooks = await service.getOrderbooks(symbols);

      // then
      expect(orderbooks[0]).toEqual({
        symbol: res[0].market,
        askPrice: res[0].orderbook_units[0].ask_price,
        bidPrice: res[0].orderbook_units[0].bid_price,
      });
    });

    it('should return 2 orderbooks with 2 symbols', async () => {
      // given
      const symbols = ['KRW-BTC', 'KRW-ETH'];

      const res: UpbitOrderbookResponse[] = [
        {
          market: 'KRW-BTC',
          timestamp: 1706687266573,
          total_ask_size: 2.59888689,
          total_bid_size: 1.02068728,
          orderbook_units: [
            {
              ask_price: 59099000,
              bid_price: 59091000,
              ask_size: 0.03092821,
              bid_size: 0.28343708,
            },
          ],
          level: 0,
        },
        {
          market: 'KRW-ETH',
          timestamp: 1706687266639,
          total_ask_size: 128.71361844,
          total_bid_size: 206.36439601,
          orderbook_units: [
            {
              ask_price: 3216000,
              bid_price: 3214000,
              ask_size: 1.71086115,
              bid_size: 3.15299242,
            },
          ],
          level: 0,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const orderbooks = await service.getOrderbooks(symbols);

      // then
      orderbooks.map((orderbook, i) =>
        expect(orderbook).toEqual({
          symbol: res[i].market,
          askPrice: res[i].orderbook_units[0].ask_price,
          bidPrice: res[i].orderbook_units[0].bid_price,
        }),
      );
    });
  });
});
