import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { DunamuService } from './dunamu.service';
import { DunamuPriceResponse } from './interfaces/price-response.interface';

describe('DunamuService', () => {
  let service: DunamuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DunamuService],
    }).compile();

    service = module.get<DunamuService>(DunamuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateUsdPrice()', () => {
    it('should update usd', async () => {
      // given
      const mockedResponse: Partial<DunamuPriceResponse>[] = [
        {
          currencyCode: 'USD',
          basePrice: 1338.4,
        },
      ];
      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockedResponse });

      // when
      await service.updateUsdPrice();

      // then
      expect(service.getUsdPrice()).toEqual(1338.4);
    });
  });
});
