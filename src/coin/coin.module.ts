import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Price } from '../price/entities/price.entity';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import { Coin } from './entities/coin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coin, Price])],
  controllers: [CoinController],
  providers: [CoinService],
})
export class CoinModule {}
