import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { Coin } from '../coins/entities/coin.entity';
import { Price } from '../prices/entities/price.entity';
import { UpbitCoinResponse } from './interfaces/coin-response.interface';
import { PartialUpbitPriceResponse } from './types/price-response.type';
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
    it('should return all coins (quote asset = KRW)', async () => {
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
          exchange: 'Upbit',
          name: 'Bitcoin',
          symbol: 'KRW-BTC',
          baseAsset: 'BTC',
          quoteAsset: 'KRW',
          warning: false,
          message: '',
        },
        {
          exchange: 'Upbit',
          name: 'Ethereum',
          symbol: 'KRW-ETH',
          baseAsset: 'ETH',
          quoteAsset: 'KRW',
          warning: true,
          message: 'CAUTION',
        },
      ];
      expect(result).toEqual(expectedCoins);
    });
  });

  describe('fetchPrices()', () => {
    it('should return 0 prices with 0 symbols', async () => {
      // given
      const symbols: string[] = [];

      const mockedResponse: PartialUpbitPriceResponse[] = [];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchPrices(symbols);

      // then
      const expectedPrices: Partial<Coin & Price>[] = [];
      expect(result).toEqual(expectedPrices);
    });

    it('should return 1 price with 1 symbol', async () => {
      // given
      const symbols: string[] = ['KRW-BTC'];

      const mockedResponse: PartialUpbitPriceResponse[] = [
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
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchPrices(symbols);

      // then
      const expectedPrices: Partial<Coin & Price>[] = [
        {
          exchange: 'Upbit',
          symbol: 'KRW-BTC',
          askPrice: 59101000,
          bidPrice: 59100000,
        },
      ];
      expect(result).toEqual(expectedPrices);
    });

    it('should return 2 prices with 2 symbols', async () => {
      // given
      const symbols: string[] = ['KRW-BTC', 'KRW-ETH'];

      const mockedResponse: PartialUpbitPriceResponse[] = [
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
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchPrices(symbols);

      // then
      const expectedPrices: Partial<Coin & Price>[] = [
        {
          exchange: 'Upbit',
          symbol: 'KRW-BTC',
          askPrice: 59099000,
          bidPrice: 59091000,
        },
        {
          exchange: 'Upbit',
          symbol: 'KRW-ETH',
          askPrice: 3216000,
          bidPrice: 3214000,
        },
      ];
      expect(result).toEqual(expectedPrices);
    });
  });
});
