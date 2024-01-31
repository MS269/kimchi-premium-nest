import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { BinanceService } from './binance.service';
import { BinanceOrderbookResponse } from './interfaces/orderbook-response.interface';

jest.mock('axios');

describe('BinanceService', () => {
  let service: BinanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceService],
    }).compile();

    service = module.get<BinanceService>(BinanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrderbooks()', () => {
    it('should return 1 orderbook with 1 symbol', async () => {
      // given
      const symbols = ['KRW-BTC'];

      const res: BinanceOrderbookResponse[] = [
        {
          symbol: 'BTCUSDT',
          bidPrice: 43005.61,
          bidQty: 6.82923,
          askPrice: 43005.62,
          askQty: 2.60722,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const orderbooks = await service.getOrderbooks(symbols);

      // then
      expect(orderbooks.length).toBe(symbols.length);

      expect(orderbooks[0]).toEqual({
        symbol: res[0].symbol,
        askPrice: res[0].askPrice,
        bidPrice: res[0].bidPrice,
      });
    });

    it('should return 2 orderbooks with 2 symbols', async () => {
      // given
      const symbols = ['KRW-BTC', 'KRW-ETH'];

      const res: BinanceOrderbookResponse[] = [
        {
          symbol: 'BTCUSDT',
          bidPrice: 43000.34,
          bidQty: 2.56752,
          askPrice: 43000.35,
          askQty: 11.37092,
        },
        {
          symbol: 'BNBUSDT',
          bidPrice: 307.3,
          bidQty: 221.269,
          askPrice: 307.4,
          askQty: 250.429,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const orderbooks = await service.getOrderbooks(symbols);

      // then
      expect(orderbooks.length).toBe(symbols.length);

      orderbooks.map((orderbook, i) =>
        expect(orderbook).toEqual({
          symbol: res[i].symbol,
          askPrice: res[i].askPrice,
          bidPrice: res[i].bidPrice,
        }),
      );
    });
  });
});
