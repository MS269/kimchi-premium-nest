import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Exchange } from '../../exchange/entities/exchange.entity';
import { Price } from '../../price/entities/price.entity';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exchange, (exchange) => exchange.coins)
  exchange: Exchange;

  @Column()
  exchangeName: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  symbol: string;

  @Column()
  baseAsset: string;

  @Column()
  quoteAsset: string;

  @OneToOne(() => Price, (price) => price.coin, { nullable: true })
  @JoinColumn()
  price?: Price;

  @Column({ nullable: true })
  priceId?: number;

  @Column({ default: '' })
  warning: string;
}
