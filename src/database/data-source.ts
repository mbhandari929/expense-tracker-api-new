import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Expense } from '../expense/entities/expense.entity';
import { Income } from '../income/entities/income.entity';
import { Settings } from '../settings/entities/settings.entity';
import { User } from '../users/entities/user.entity';

export default new DataSource({
  type: 'better-sqlite3',
  database: process.env.DATABASE_PATH ?? 'expense.db',
  entities: [Income, Expense, Settings, User],
  migrations: ['dist/src/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
