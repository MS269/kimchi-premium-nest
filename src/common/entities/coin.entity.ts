import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Price } from './price.entity';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exchange: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  symbol: string;

  @Column()
  baseAsset: string;

  @Column()
  quoteAsset: string;

  @OneToMany(() => Price, (price) => price.coin)
  prices: Price[];

  @Column({ default: false })
  warning: boolean;

  @Column({ default: '' })
  message: string;
}
