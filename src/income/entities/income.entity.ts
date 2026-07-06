import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  source!: string;

  @Column()
  amount!: number;

  @Column()
  date!: string;
}