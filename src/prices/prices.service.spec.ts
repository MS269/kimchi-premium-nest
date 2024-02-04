import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoinsService } from '../coins/coins.service';
import { Price } from './entities/price.entity';
import { PricesService } from './prices.service';

describe('PricesService', () => {
  let service: PricesService;
  let repository: Repository<Price>;
  let coinsService: CoinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricesService,
        { provide: getRepositoryToken(Price), useValue: {} },
        { provide: CoinsService, useValue: {} },
      ],
    }).compile();

    service = module.get<PricesService>(PricesService);
    repository = module.get<Repository<Price>>(getRepositoryToken(Price));
    coinsService = module.get<CoinsService>(CoinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
