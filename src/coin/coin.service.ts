import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindCoinDto } from './dto/find-coin.dto';
import { Coin } from './entities/coin.entity';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {}

  async findAll() {
    return this.coinRepository.find();
  }

  async findBy(dto: FindCoinDto) {
    return this.coinRepository.findBy(dto);
  }

  async findOneBy(dto: FindCoinDto) {
    return this.coinRepository.findOneBy(dto);
  }
}
