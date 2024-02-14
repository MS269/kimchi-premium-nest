import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { Coin } from '../coin/entities/coin.entity';
import { Price } from '../price/entities/price.entity';
import { UpbitCoinResponse } from './interfaces/coin-response.interface';
import { UpbitPriceResponse } from './interfaces/price-response.interface';
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
          exchangeName: 'Upbit',
          name: 'Bitcoin',
          symbol: 'KRW-BTC',
          baseAsset: 'BTC',
          quoteAsset: 'KRW',
          warning: '',
        },
        {
          exchangeName: 'Upbit',
          name: 'Ethereum',
          symbol: 'KRW-ETH',
          baseAsset: 'ETH',
          quoteAsset: 'KRW',
          warning: 'CAUTION',
        },
      ];
      expect(result).toEqual(expectedCoins);
    });
  });

  describe('fetchPrices()', () => {
    it('should return 0 prices with 0 symbols', async () => {
      // given
      const symbols: string[] = [];

      const mockedResponse: Partial<UpbitPriceResponse>[] = [];
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

      const mockedResponse: Partial<UpbitPriceResponse>[] = [
        {
          market: 'KRW-BTC',
          trade_price: 67164000.0,
          timestamp: 1707880140044,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchPrices(symbols);

      // then
      const expectedPrices: Partial<Coin & Price>[] = [
        {
          exchangeName: 'Upbit',
          symbol: 'KRW-BTC',
          krw: 67164000,
          timestamp: new Date(1707880140044),
        },
      ];
      expect(result).toEqual(expectedPrices);
    });

    it('should return 2 prices with 2 symbols', async () => {
      // given
      const symbols: string[] = ['KRW-BTC', 'KRW-ETH'];

      const mockedResponse: Partial<UpbitPriceResponse>[] = [
        {
          market: 'KRW-BTC',
          trade_price: 67164000.0,
          timestamp: 1707880140044,
        },
        {
          market: 'KRW-ETH',
          trade_price: 3578000.0,
          timestamp: 1707880968715,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      const result = await service.fetchPrices(symbols);

      // then
      const expectedPrices: Partial<Coin & Price>[] = [
        {
          exchangeName: 'Upbit',
          symbol: 'KRW-BTC',
          krw: 67164000.0,
          timestamp: new Date(1707880140044),
        },
        {
          exchangeName: 'Upbit',
          symbol: 'KRW-ETH',
          krw: 3578000.0,
          timestamp: new Date(1707880968715),
        },
      ];
      expect(result).toEqual(expectedPrices);
    });
  });

  describe('fetchOrderbooks()', () => {
    // TODO
  });
});
