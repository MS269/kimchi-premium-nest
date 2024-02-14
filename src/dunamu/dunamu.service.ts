import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';

import { DunamuPriceResponse } from './interfaces/price-response.interface';

@Injectable()
export class DunamuService {
  private readonly logger = new Logger(DunamuService.name);

  private usd = 0;

  getUsdPrice() {
    return this.usd;
  }

  async updateUsdPrice() {
    try {
      const { data } = await axios.get<DunamuPriceResponse[]>(
        'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD',
        { params: { codes: 'FRX.KRWUSD' } },
      );

      if (data[0] && data[0].currencyCode === 'USD' && data[0].basePrice) {
        this.usd = data[0].basePrice;
      } else {
        throw new NotFoundException('USD not found');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
