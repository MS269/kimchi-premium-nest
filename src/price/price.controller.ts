import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { PriceService } from './price.service';

@Controller('coins/:coinId/prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  async findBetweenDates(
    @Param('coinId') coinId: string,
    @Query() query: { start?: string; end?: string },
  ) {
    const { start, end } = query;

    if (!start && !end) {
      return this.priceService.findByCoinId(+coinId);
    } else if (start && !end) {
      return this.priceService.findBetweenDates(
        +coinId,
        new Date(start),
        new Date(),
      );
    } else if (start && end) {
      return this.priceService.findBetweenDates(
        +coinId,
        new Date(start),
        new Date(end),
      );
    } else {
      throw new NotFoundException();
    }
  }
}
