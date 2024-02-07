import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Coin } from './coin.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Coin, (coin) => coin.prices)
  coin: Coin;

  @Column()
  bidPrice: number;

  @Column()
  askPrice: number;

  @CreateDateColumn()
  timestamp: Date;
}
