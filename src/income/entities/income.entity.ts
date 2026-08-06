import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'source' })
  text!: string;

  @Column()
  amount!: number;

  @Column()
  date!: string;
}
