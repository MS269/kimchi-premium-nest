import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { Coin } from '../coin/entities/coin.entity';
import { UpbitCoinResponse } from './interfaces/coin-response.interface';
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
    // TODO
  });

  describe('fetchOrderbooks()', () => {
    // TODO
  });
});
