import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Coin } from '../../coins/entities/coin.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Coin, (coin) => coin.id)
  coin: Coin;

  @Column()
  bidPrice: number;

  @Column()
  askPrice: number;

  @CreateDateColumn()
  timestamp: Date;
}
