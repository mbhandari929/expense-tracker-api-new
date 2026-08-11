import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer', default: 0 })
  openingBalance!: number;

  @Column({ type: 'simple-json' })
  incomeSources!: string[];

  @Column({ type: 'simple-json' })
  expenseSources!: string[];

  @Column({ type: 'simple-json' })
  monthlyBudgets!: Record<string, number>;

  @OneToOne(() => User, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
