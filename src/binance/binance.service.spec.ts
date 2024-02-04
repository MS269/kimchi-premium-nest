import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { Coin } from '../coins/entities/coin.entity';
import { Price } from '../prices/entities/price.entity';
import { BinanceService } from './binance.service';
import { BinancePriceResponse } from './interfaces/price-response.interface';
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
            symbol: 'BTCUSDT',
            status: 'TRADING',
            baseAsset: 'BTC',
            quoteAsset: 'USDT',
          },
          {
            symbol: 'ETHUSDT',
            status: 'BREAK',
            baseAsset: 'ETH',
            quoteAsset: 'USDT',
          },
          {
            symbol: 'ETHBTC',
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
          exchange: 'Binance',
          symbol: 'BTCUSDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          warning: false,
          message: '',
        },
        {
          exchange: 'Binance',
          symbol: 'ETHUSDT',
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          warning: true,
          message: 'BREAK',
        },
      ];
      expect(result).toEqual(expectedCoins);
    });
  });

  describe('fetchPrices()', () => {
    it('should return 0 prices with 0 symbols', async () => {
      // given
      const symbols: string[] = [];

      const mockedResponse: Partial<BinancePriceResponse>[] = [];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchPrices(symbols);

      // then
      const expectedPrices: Partial<Coin & Price>[] = [];
      expect(result).toEqual(expectedPrices);
    });

    it('should return 1 price with 1 symbol', async () => {
      // given
      const symbols: string[] = ['BTCUSDT'];

      const mockedResponse: Partial<BinancePriceResponse>[] = [
        {
          symbol: 'BTCUSDT',
          bidPrice: 43005.61,
          askPrice: 43005.62,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchPrices(symbols);

      // then
      const expectedPrices: Partial<Coin & Price>[] = [
        {
          exchange: 'Binance',
          symbol: 'BTCUSDT',
          bidPrice: 43005.61,
          askPrice: 43005.62,
        },
      ];
      expect(result).toEqual(expectedPrices);
    });

    it('should return 2 prices with 2 symbols', async () => {
      // given
      const symbols: string[] = ['BTCUSDT', 'ETHUSDT'];

      const mockedResponse: Partial<BinancePriceResponse>[] = [
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
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchPrices(symbols);

      // then
      const expectedPrices: Partial<Coin & Price>[] = [
        {
          exchange: 'Binance',
          symbol: 'BTCUSDT',
          bidPrice: 43000.34,
          askPrice: 43000.35,
        },
        {
          exchange: 'Binance',
          symbol: 'ETHUSDT',
          bidPrice: 2306.9,
          askPrice: 2306.91,
        },
      ];
      expect(result).toEqual(expectedPrices);
    });
  });
});
