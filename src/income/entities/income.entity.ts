import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
