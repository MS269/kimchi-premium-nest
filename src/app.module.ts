import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BinanceModule } from './binance/binance.module';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmConfigService } from './type-orm-config/type-orm-config.service';
import { UpbitModule } from './upbit/upbit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ScheduleModule.forRoot(),
    TasksModule,
    UpbitModule,
    BinanceModule,
  ],
})
export class AppModule {}
