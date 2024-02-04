import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BinanceService } from '../binance/binance.service';
import { Coin } from '../common/entities/coin.entity';
import { Price } from '../common/entities/price.entity';
import { UpbitService } from '../upbit/upbit.service';

@Injectable()
export class TasksService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @InjectRepository(Price)
    private readonly PriceRepository: Repository<Price>,
    private readonly upbitService: UpbitService,
    private readonly binanceService: BinanceService,
  ) {}

  async onApplicationBootstrap() {
    await this.updateAllCoins();
    await this.updateAllPrices();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAllCoins() {
    const now = Date.now();

    const upbitCoins = await this.upbitService.fetchAllCoins();
    const binanceCoins = await this.binanceService.fetchAllCoins();

    const coins = [...upbitCoins, ...binanceCoins];

    await Promise.all(
      coins.map(async (coin: Coin) => {
        const exists = await this.coinRepository
          .createQueryBuilder('coin')
          .select('coin.id')
          .where('coin.exchange = :exchange', { exchange: coin.exchange })
          .andWhere('coin.symbol = :symbol', { symbol: coin.symbol })
          .getOne();

        if (exists) {
          await this.coinRepository.update(
            { id: exists.id },
            {
              warning: coin.warning,
              message: coin.message,
            },
          );
        } else {
          await this.coinRepository.insert({
            exchange: coin.exchange,
            name: coin?.name,
            symbol: coin.symbol,
            baseAsset: coin.baseAsset,
            quoteAsset: coin.quoteAsset,
            warning: coin.warning,
            message: coin.message,
          });
        }
      }),
    );

    this.logger.log(`${this.updateAllCoins.name}() +${Date.now() - now}ms`);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAllPrices() {
    const now = Date.now();

    const upbitCoins = await this.coinRepository
      .createQueryBuilder('coin')
      .select('coin.symbol')
      .where('coin.exchange = :exchange', { exchange: 'Upbit' })
      .getMany();
    const binanceCoins = await this.coinRepository
      .createQueryBuilder('coin')
      .select('coin.symbol')
      .where('coin.exchange = :exchange', { exchange: 'Binance' })
      .getMany();

    const upbitSymbols = upbitCoins.map((coin) => coin.symbol);
    const binanceSymbols = binanceCoins.map((coin) => coin.symbol);

    const upbitPrices = await this.upbitService.fetchPrices(upbitSymbols);
    const binancePrices = await this.binanceService.fetchPrices(binanceSymbols);

    const prices = [...upbitPrices, ...binancePrices];

    await Promise.all(
      prices.map(async (price) => {
        const coin = await this.coinRepository
          .createQueryBuilder('coin')
          .select('coin.id')
          .where('coin.exchange = :exchange', { exchange: price.exchange })
          .andWhere('coin.symbol = :symbol', { symbol: price.symbol })
          .getOne();

        await this.PriceRepository.save({
          coin,
          bidPrice: price.bidPrice,
          askPrice: price.askPrice,
        });
      }),
    );

    this.logger.log(`${this.updateAllPrices.name}() +${Date.now() - now}ms`);
  }
}
