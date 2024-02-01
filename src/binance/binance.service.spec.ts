import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { Coin } from '../coins/entities/coin.entity';
import { BinanceService } from './binance.service';
import { BinanceOrderbookResponse } from './interfaces/orderbook-response.interface';
import { PartialBinanceCoinsResponse } from './types/coin-response.type';

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

  describe('fetchAllCoins()', () => {
    it('should return all coins (quote asset = USDT)', async () => {
      // given
      const mockedResponse: PartialBinanceCoinsResponse = {
        symbols: [
          {
            status: 'TRADING',
            baseAsset: 'BTC',
            quoteAsset: 'USDT',
          },
          {
            status: 'BREAK',
            baseAsset: 'ETH',
            quoteAsset: 'USDT',
          },
          {
            status: 'TRADING',
            baseAsset: 'ETH',
            quoteAsset: 'BTC',
          },
        ],
      };
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchAllCoins();

      // then
      const expectedCoins: Partial<Coin>[] = [
        {
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          warning: false,
        },
        {
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          warning: true,
        },
      ];
      expect(result).toEqual(expectedCoins);
    });
  });

  describe('getOrderbooks()', () => {
    it('should return 1 orderbook with 1 symbol', async () => {
      // given
      const symbols = ['BTC-USDT'];

      const res: Partial<BinanceOrderbookResponse>[] = [
        {
          symbol: 'BTCUSDT',
          bidPrice: 43005.61,
          askPrice: 43005.62,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const orderbooks = await service.getOrderbooks(symbols);

      // then
      expect(orderbooks.length).toBe(symbols.length);

      expect(orderbooks[0]).toEqual({
        symbol: symbols[0].replace('-', ''),
        askPrice: res[0].askPrice,
        bidPrice: res[0].bidPrice,
      });
    });

    it('should return 2 orderbooks with 2 symbols', async () => {
      // given
      const symbols = ['BTC-USDT', 'ETH-USDT'];

      const res: Partial<BinanceOrderbookResponse>[] = [
        {
          symbol: 'BTCUSDT',
          bidPrice: 43000.34,
          askPrice: 43000.35,
        },
        {
          symbol: 'ETHUSDT',
          bidPrice: 2306.9,
          askPrice: 2306.91,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: res });

      // when
      const orderbooks = await service.getOrderbooks(symbols);

      // then
      expect(orderbooks.length).toBe(symbols.length);

      orderbooks.map((orderbook, i) =>
        expect(orderbook).toEqual({
          symbol: symbols[i].replace('-', ''),
          askPrice: res[i].askPrice,
          bidPrice: res[i].bidPrice,
        }),
      );
    });
  });
});
