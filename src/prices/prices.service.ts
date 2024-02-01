import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CoinsService } from '../coins/coins.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Price } from './entities/price.entity';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price)
    private readonly pricesRepository: Repository<Price>,
    private readonly coinsService: CoinsService,
  ) {}

  async create(createPriceDto: CreatePriceDto) {
    const { coinId, ...rest } = createPriceDto;

    const coin = await this.coinsService.findOne(coinId);

    if (!coin) {
      throw new NotFoundException('Coin not found');
    }

    return this.pricesRepository.save({
      coin,
      ...rest,
    });
  }

  async findAll() {
    return this.pricesRepository.find();
  }

  async findOne(id: number) {
    return this.pricesRepository.findOneBy({ id });
  }

  async update(id: number, updatePriceDto: UpdatePriceDto) {
    return this.pricesRepository.update(id, updatePriceDto);
  }

  async remove(id: number) {
    return this.pricesRepository.delete(id);
  }
}
