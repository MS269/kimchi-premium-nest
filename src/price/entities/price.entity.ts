import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Coin } from '../../coin/entities/coin.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Coin, (coin) => coin.price)
  coin: Coin;

  @Column()
  coinId: number;

  @Column({ type: 'float' })
  krw: number;

  @Column({ type: 'float', nullable: true })
  usdt?: number;

  @CreateDateColumn()
  timestamp: Date;
}
