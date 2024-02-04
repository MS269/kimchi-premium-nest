import { Test, TestingModule } from '@nestjs/testing';

import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';

describe('PricesController', () => {
  let controller: PricesController;
  let service: PricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricesController],
      providers: [{ provide: PricesService, useValue: {} }],
    }).compile();

    controller = module.get<PricesController>(PricesController);
    service = module.get<PricesService>(PricesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
