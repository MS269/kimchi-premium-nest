import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BinanceModule } from '../binance/binance.module';
import { Coin } from '../coin/entities/coin.entity';
import { DunamuModule } from '../dunamu/dunamu.module';
import { Exchange } from '../exchange/entities/exchange.entity';
import { OrderConfig } from '../order-config/entities/order-config.entity';
import { Price } from '../price/entities/price.entity';
import { UpbitModule } from '../upbit/upbit.module';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exchange, Coin, Price, OrderConfig]),
    DunamuModule,
    UpbitModule,
    BinanceModule,
  ],
  providers: [TaskService],
})
export class TaskModule {}
