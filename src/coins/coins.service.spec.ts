import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoinsService } from './coins.service';
import { Coin } from './entities/coin.entity';

describe('CoinsService', () => {
  let service: CoinsService;
  let repository: Repository<Coin>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoinsService,
        { provide: getRepositoryToken(Coin), useValue: {} },
      ],
    }).compile();

    service = module.get<CoinsService>(CoinsService);
    repository = module.get<Repository<Coin>>(getRepositoryToken(Coin));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
