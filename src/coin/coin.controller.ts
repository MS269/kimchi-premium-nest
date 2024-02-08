import { Controller, Get, NotFoundException, Query } from '@nestjs/common';

import {
  assetFormatter,
  exchangeFormatter,
} from '../common/utils/formatter.utils';
import { CoinService } from './coin.service';

@Controller('coins')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get()
  async findByExchangeAndAsset(
    @Query()
    query: {
      exchange?: string;
      baseAsset?: string;
      quoteAsset?: string;
    },
  ) {
    const { exchange, baseAsset, quoteAsset } = query;

    if (!exchange && !baseAsset && !quoteAsset) {
      return this.coinService.findAll();
    } else if (exchange && !baseAsset && !quoteAsset) {
      return this.coinService.findBy({ exchange: exchangeFormatter(exchange) });
    } else if (exchange && baseAsset && quoteAsset) {
      return this.coinService.findOneBy({
        exchange: exchangeFormatter(exchange),
        baseAsset: assetFormatter(baseAsset),
        quoteAsset: assetFormatter(quoteAsset),
      });
    } else {
      throw new NotFoundException();
    }
  }
}
