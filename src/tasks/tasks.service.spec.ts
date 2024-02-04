import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BinanceService } from '../binance/binance.service';
import { Coin } from '../common/entities/coin.entity';
import { Price } from '../common/entities/price.entity';
import { UpbitService } from '../upbit/upbit.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let coinRepository: Repository<Coin>;
  let priceRepository: Repository<Price>;
  let upbitService: UpbitService;
  let binanceService: BinanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Coin), useValue: {} },
        { provide: getRepositoryToken(Price), useValue: {} },
        { provide: UpbitService, useValue: { fetchAllCoins: jest.fn() } },
        { provide: BinanceService, useValue: { fetchAllCoins: jest.fn() } },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    coinRepository = module.get<Repository<Coin>>(getRepositoryToken(Coin));
    priceRepository = module.get<Repository<Price>>(getRepositoryToken(Price));
    upbitService = module.get<UpbitService>(UpbitService);
    binanceService = module.get<BinanceService>(BinanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap()', () => {
    it('should run functions', async () => {
      // given
      jest.spyOn(service, 'updateAllCoins').mockResolvedValueOnce();
      jest.spyOn(service, 'updateAllPrices').mockResolvedValueOnce();

      // when
      await service.onApplicationBootstrap();

      // then
      expect(service.updateAllCoins).toHaveBeenCalled();
      expect(service.updateAllPrices).toHaveBeenCalled();
    });
  });

  describe('updateAllCoins()', () => {
    it('should fetch coins and insert or update them', () => {
      // TODO
      // given
      // when
      // then
    });
  });

  describe('updateAllPrices()', () => {
    it('should fetch prices and insert them', () => {
      // TODO
      // given
      // when
      // then
    });
  });
});
