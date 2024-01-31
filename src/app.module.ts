import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BinanceModule } from './binance/binance.module';
import { TypeOrmConfigService } from './type-orm-config/type-orm-config.service';
import { UpbitModule } from './upbit/upbit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UpbitModule,
    BinanceModule,
  ],
})
export class AppModule {}
