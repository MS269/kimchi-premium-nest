import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class OrderConfig {
  @PrimaryColumn()
  key: string;

  @Column()
  value: string;
}
