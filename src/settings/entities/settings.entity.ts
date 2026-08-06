import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
