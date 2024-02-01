import { Module } from '@nestjs/common';

import { BinanceModule } from '../binance/binance.module';
import { CoinsModule } from '../coins/coins.module';
import { PricesModule } from '../prices/prices.module';
import { UpbitModule } from '../upbit/upbit.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [CoinsModule, PricesModule, UpbitModule, BinanceModule],
  providers: [TasksService],
})
export class TasksModule {}
