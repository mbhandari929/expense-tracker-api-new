import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Expense } from '../expense/entities/expense.entity';
import { Income } from '../income/entities/income.entity';
import { Settings } from '../settings/entities/settings.entity';
import { User } from '../users/entities/user.entity';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@Injectable()
export class BackupService {
  constructor(private readonly dataSource: DataSource) {}

  async restore(restoreBackupDto: RestoreBackupDto, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      await manager
        .getRepository(Income)
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId })
        .execute();

      await manager
        .getRepository(Expense)
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId })
        .execute();

      await manager
        .getRepository(Settings)
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', { userId })
        .execute();

      const incomes = manager.create(
        Income,
        restoreBackupDto.incomes.map((item) => ({
          text: item.text,
          amount: item.amount,
          date: item.date,
          user: { id: userId } as User,
        })),
      );

      const expenses = manager.create(
        Expense,
        restoreBackupDto.expenses.map((item) => ({
          text: item.text,
          amount: item.amount,
          date: item.date,
          user: { id: userId } as User,
        })),
      );

      const settings = manager.create(Settings, {
        openingBalance: restoreBackupDto.openingBalance,
        incomeSources: restoreBackupDto.incomeSources,
        expenseSources: restoreBackupDto.expenseSources,
        monthlyBudgets: restoreBackupDto.monthlyBudgets,
        user: { id: userId } as User,
      });

      const savedIncomes = await manager.save(Income, incomes);

      const savedExpenses = await manager.save(Expense, expenses);

      const savedSettings = await manager.save(Settings, settings);

      return {
        message: 'Backup restored successfully',
        incomes: savedIncomes,
        expenses: savedExpenses,
        settings: savedSettings,
      };
    });
  }
}
