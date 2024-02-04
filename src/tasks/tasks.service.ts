import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BinanceService } from '../binance/binance.service';
import { CoinsService } from '../coins/coins.service';
import { PricesService } from '../prices/prices.service';
import { UpbitService } from '../upbit/upbit.service';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly coinsService: CoinsService,
    private readonly pricesService: PricesService,
    private readonly upbitService: UpbitService,
    private readonly binanceService: BinanceService,
  ) {}

  async onApplicationBootstrap() {
    await this.updateAllCoins();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAllCoins() {
    const now = Date.now();

    const upbitCoins = await this.upbitService.fetchAllCoins();
    const binanceCoins = await this.binanceService.fetchAllCoins();

    await Promise.all(
      upbitCoins.map(async (coin) => {
        const exists = await this.coinsService.findOneBy({
          exchange: 'Upbit',
          baseAsset: coin.baseAsset,
          quoteAsset: coin.quoteAsset,
        });

        if (exists) {
          await this.coinsService.update(exists.id, {
            warning: coin.warning,
          });
        } else {
          await this.coinsService.create({
            exchange: 'Upbit',
            name: coin.name,
            baseAsset: coin.baseAsset,
            quoteAsset: coin.quoteAsset,
            warning: coin.warning,
          });
        }
      }),
    );

    await Promise.all(
      binanceCoins.map(async (coin) => {
        const exists = await this.coinsService.findOneBy({
          exchange: 'Binance',
          baseAsset: coin.baseAsset,
          quoteAsset: coin.quoteAsset,
        });

        if (exists) {
          await this.coinsService.update(exists.id, { warning: coin.warning });
        } else {
          await this.coinsService.create({
            exchange: 'Binance',
            baseAsset: coin.baseAsset,
            quoteAsset: coin.quoteAsset,
            warning: coin.warning,
          });
        }
      }),
    );

    this.logger.log(`${this.updateAllCoins.name}() +${Date.now() - now}ms`);
  }
}
