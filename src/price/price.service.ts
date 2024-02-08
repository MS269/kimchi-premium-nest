import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Price } from './entities/price.entity';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async findByCoinId(coinId: number) {
    return this.priceRepository
      .createQueryBuilder('price')
      .where('price.coinId = :coinId', { coinId })
      .orderBy('price.timestamp', 'DESC')
      .limit(1)
      .getOne();
  }

  async findBetweenDates(coinId: number, start: Date, end: Date) {
    return this.priceRepository
      .createQueryBuilder('price')
      .where('price.coinId = :coinId', { coinId })
      .andWhere('price.timestamp >= :start', { start })
      .andWhere('price.timestamp <= :end', { end })
      .orderBy('price.timestamp', 'DESC')
      .getMany();
  }
}
