import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCoinDto } from './dto/create-coin.dto';
import { UpdateCoinDto } from './dto/update-coin.dto';
import { Coin } from './entities/coin.entity';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinsRepository: Repository<Coin>,
  ) {}

  async create(createCoinDto: CreateCoinDto) {
    return this.coinsRepository.save(createCoinDto);
  }

  async findAll() {
    return this.coinsRepository.find();
  }

  async findOne(id: number) {
    return this.coinsRepository.findOneBy({ id });
  }

  async update(id: number, updateCoinDto: UpdateCoinDto) {
    return this.coinsRepository.update(id, updateCoinDto);
  }

  async remove(id: number) {
    return this.coinsRepository.delete(id);
  }
}
