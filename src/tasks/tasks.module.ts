import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BinanceModule } from '../binance/binance.module';
import { Coin } from '../common/entities/coin.entity';
import { Price } from '../common/entities/price.entity';
import { UpbitModule } from '../upbit/upbit.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coin, Price]),
    UpbitModule,
    BinanceModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
