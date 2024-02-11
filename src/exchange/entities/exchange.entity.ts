import { Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';

import { Coin } from '../../coin/entities/coin.entity';

@Entity()
export class Exchange {
  @PrimaryColumn()
  name: string;

  @OneToMany(() => Coin, (coin) => coin.exchange, { nullable: true })
  @JoinColumn()
  coins?: Coin[];
}
