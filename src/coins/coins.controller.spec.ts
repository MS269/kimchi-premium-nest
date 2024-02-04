import { Test, TestingModule } from '@nestjs/testing';

import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';

describe('CoinsController', () => {
  let controller: CoinsController;
  let service: CoinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoinsController],
      providers: [{ provide: CoinsService, useValue: {} }],
    }).compile();

    controller = module.get<CoinsController>(CoinsController);
    service = module.get<CoinsService>(CoinsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
