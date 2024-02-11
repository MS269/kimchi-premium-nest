import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { Coin } from '../coin/entities/coin.entity';
import { BinanceService } from './binance.service';
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
          exchangeName: 'Binance',
          symbol: 'BTCUSDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          warning: '',
        },
        {
          exchangeName: 'Binance',
          symbol: 'ETHUSDT',
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          warning: 'BREAK',
        },
      ];
      expect(result).toEqual(expectedCoins);
    });
  });

  describe('fetchPrices()', () => {
    // TDOO
  });

  describe('fetchOrderbooks()', () => {
    // TODO
  });
});
