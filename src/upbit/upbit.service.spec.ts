import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { UpbitSymbolResponse } from './interfaces/symbol-response.interface';
import { PartialUpbitOrderbookResponse } from './types/orderbook-response.type';
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

  describe('getSymbols()', () => {
    it('should return all symbols which starts with KRW', async () => {
      // given
      const res: Partial<UpbitSymbolResponse>[] = [
        {
          market_warning: 'NONE',
          market: 'KRW-BTC',
        },
        {
          market_warning: 'NONE',
          market: 'KRW-ETH',
        },
        {
          market_warning: 'NONE',
          market: 'BTC-ETH',
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const symbols = await service.getAllSymbols();

      // then
      const filtered: Partial<UpbitSymbolResponse>[] = [
        {
          market_warning: 'NONE',
          market: 'KRW-BTC',
        },
        {
          market_warning: 'NONE',
          market: 'KRW-ETH',
        },
      ];

      expect(symbols.length).toBe(filtered.length);

      symbols.map((symbol, i) =>
        expect(symbol).toEqual({
          symbol: filtered[i].market,
          warning: filtered[i].market_warning !== 'NONE',
        }),
      );
    });
  });

  describe('getOrderbooks()', () => {
    it('should return 1 orderbook with 1 symbol', async () => {
      // given
      const symbols = ['KRW-BTC'];

      const res: PartialUpbitOrderbookResponse[] = [
        {
          market: 'KRW-BTC',
          orderbook_units: [
            {
              ask_price: 59101000,
              bid_price: 59100000,
            },
          ],
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const orderbooks = await service.getOrderbooks(symbols);

      // then
      expect(orderbooks.length).toBe(symbols.length);

      expect(orderbooks[0]).toEqual({
        symbol: symbols[0],
        askPrice: res[0].orderbook_units[0].ask_price,
        bidPrice: res[0].orderbook_units[0].bid_price,
      });
    });

    it('should return 2 orderbooks with 2 symbols', async () => {
      // given
      const symbols = ['KRW-BTC', 'KRW-ETH'];

      const res: PartialUpbitOrderbookResponse[] = [
        {
          market: 'KRW-BTC',
          orderbook_units: [
            {
              ask_price: 59099000,
              bid_price: 59091000,
            },
          ],
        },
        {
          market: 'KRW-ETH',
          orderbook_units: [
            {
              ask_price: 3216000,
              bid_price: 3214000,
            },
          ],
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const orderbooks = await service.getOrderbooks(symbols);

      // then
      expect(orderbooks.length).toBe(symbols.length);

      orderbooks.map((orderbook, i) =>
        expect(orderbook).toEqual({
          symbol: symbols[i],
          askPrice: res[i].orderbook_units[0].ask_price,
          bidPrice: res[i].orderbook_units[0].bid_price,
        }),
      );
    });
  });
});
