import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BinanceService } from '../binance/binance.service';
import { Coin } from '../coin/entities/coin.entity';
import { kimchiPremiumCalculator } from '../common/utils/calculator.utils';
import { Exchange } from '../exchange/entities/exchange.entity';
import { Price } from '../price/entities/price.entity';
import { UpbitService } from '../upbit/upbit.service';

@Injectable()
export class TaskService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,

    private readonly upbitService: UpbitService,
    private readonly binanceService: BinanceService,
  ) {}

  async onApplicationBootstrap() {
    await this.createExchanges();
    await this.updateAllCoins();
    await this.updateAllPrices();
    await this.calculateKimchiPremium();
  }

  async createExchanges() {
    const now = Date.now();

    await this.exchangeRepository.save({ name: 'Upbit' });
    await this.exchangeRepository.save({ name: 'Binance' });

    this.logger.log(`createExchanges() +${Date.now() - now}ms`);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAllCoins() {
    const now = Date.now();

    const upbitCoins = await this.upbitService.fetchAllCoins();
    const binanceCoins = await this.binanceService.fetchAllCoins();

    await Promise.all(
      [...upbitCoins, ...binanceCoins].map(async (coin: Partial<Coin>) => {
        const exists = await this.coinRepository.findOne({
          select: { id: true, warning: true },
          where: {
            exchangeName: coin.exchangeName,
            symbol: coin.symbol,
          },
        });

        if (!exists) {
          const exchange = await this.exchangeRepository.findOne({
            where: { name: coin.exchangeName },
            cache: true,
          });

          return this.coinRepository.save({
            exchange,
            exchangeName: coin.exchangeName,
            name: coin?.name,
            symbol: coin.symbol,
            baseAsset: coin.baseAsset,
            quoteAsset: coin.quoteAsset,
            warning: coin.warning,
          });
        }

        if (coin.warning !== '' && exists.warning === '') {
          this.logger.log(
            `${coin.exchangeName}(${coin.symbol}) ${coin.warning}`,
          );

          await this.coinRepository.update(
            { id: exists.id },
            { warning: coin.warning },
          );
        }
      }),
    );

    this.logger.log(`updateAllCoins() +${Date.now() - now}ms`);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAllPrices() {
    const now = Date.now();

    const upbitCoins = await this.coinRepository.find({
      select: { symbol: true },
      where: { exchangeName: 'Upbit', warning: '' },
    });
    const binanceCoins = await this.coinRepository.find({
      select: { symbol: true },
      where: { exchangeName: 'Binance', warning: '' },
    });

    const upbitSymbols = upbitCoins.map((coin) => coin.symbol);
    const binanceSymbols = binanceCoins.map((coin) => coin.symbol);

    const upbitPrices = await this.upbitService.fetchPrices(upbitSymbols);
    const binancePrices = await this.binanceService.fetchPrices(binanceSymbols);

    await Promise.all(
      [...upbitPrices, ...binancePrices].map(
        async (price: Partial<Coin & Price>) => {
          const coin = await this.coinRepository.findOne({
            select: { id: true, quoteAsset: true },
            where: {
              exchangeName: price.exchangeName,
              symbol: price.symbol,
            },
          });

          const newPrice = this.priceRepository.create({
            coin: coin,
            coinId: coin.id,
            timestamp: price.timestamp,
          });

          if (coin.quoteAsset === 'KRW') {
            newPrice.krw = price.krw;
          } else if (coin.quoteAsset === 'USDT') {
            // TODO: exchange rate
            newPrice.krw = price.usdt * 1331.5;
            newPrice.usdt = price.usdt;
          }

          await this.priceRepository.save(newPrice);
        },
      ),
    );

    this.logger.log(`updateAllPrices() +${Date.now() - now}ms`);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async calculateKimchiPremium() {
    const now = Date.now();

    const upbit = await this.exchangeRepository.findOne({
      where: { name: 'Upbit' },
      relations: { coins: { price: true } },
    });
    const binance = await this.exchangeRepository.findOne({
      where: { name: 'Binance' },
      relations: { coins: { price: true } },
    });

    await Promise.all(
      upbit.coins.map(async (upbitCoin) => {
        if (!upbitCoin.price) {
          return;
        }

        const binanceCoin = binance.coins.find(
          (coin) => coin.baseAsset === upbitCoin.baseAsset,
        );

        if (!binanceCoin || !binanceCoin.price) {
          return;
        }

        const kimchiPremium = kimchiPremiumCalculator(
          upbitCoin.price.krw,
          binanceCoin.price.krw,
        );

        this.logger.log(
          `${upbitCoin.name}(${upbitCoin.baseAsset}) ${kimchiPremium}`,
        );
      }),
    );

    this.logger.log(`calculateKimchiPremium() +${Date.now() - now}ms`);
  }
}
