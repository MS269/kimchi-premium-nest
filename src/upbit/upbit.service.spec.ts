import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { Coin } from '../coins/entities/coin.entity';
import { UpbitCoinResponse } from './interfaces/coin-response.interface';
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

  describe('fetchAllCoins()', () => {
    it('should return all coins which starts with KRW', async () => {
      // given
      const mockedResponse: Partial<UpbitCoinResponse>[] = [
        {
          market_warning: 'NONE',
          market: 'KRW-BTC',
          english_name: 'Bitcoin',
        },
        {
          market_warning: 'CAUTION',
          market: 'KRW-ETH',
          english_name: 'Ethereum',
        },
        {
          market_warning: 'NONE',
          market: 'BTC-ETH',
          english_name: 'Ethereum',
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchAllCoins();

      // then
      const expectedCoins: Partial<Coin>[] = [
        {
          name: 'Bitcoin',
          baseAsset: 'BTC',
          quoteAsset: 'KRW',
          warning: false,
        },
        {
          name: 'Ethereum',
          baseAsset: 'ETH',
          quoteAsset: 'KRW',
          warning: true,
        },
      ];

      expect(result.length).toBe(expectedCoins.length);

      result.map((coin, i) => expect(coin).toEqual(expectedCoins[i]));
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
