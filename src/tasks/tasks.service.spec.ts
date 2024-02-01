import { Test, TestingModule } from '@nestjs/testing';

import { BinanceService } from '../binance/binance.service';
import { CoinsService } from '../coins/coins.service';
import { PricesService } from '../prices/prices.service';
import { UpbitService } from '../upbit/upbit.service';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let coinsService: CoinsService;
  let pricesService: PricesService;
  let upbitService: UpbitService;
  let binanceService: BinanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: CoinsService, useValue: {} },
        { provide: PricesService, useValue: {} },
        { provide: UpbitService, useValue: { fetchAllCoins: jest.fn() } },
        { provide: BinanceService, useValue: { fetchAllCoins: jest.fn() } },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    coinsService = module.get<CoinsService>(CoinsService);
    pricesService = module.get<PricesService>(PricesService);
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

      // when
      await service.onApplicationBootstrap();

      // then
      expect(service.updateAllCoins).toHaveBeenCalled();
    });
  });

  describe('updateAllCoins()', () => {
    it('should fetch coins and create or update them', () => {
      // TODO
      // given
      // when
      // then
    });
  });
});
