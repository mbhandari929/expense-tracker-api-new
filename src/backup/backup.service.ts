import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Expense } from '../expense/entities/expense.entity';
import { Income } from '../income/entities/income.entity';
import { Settings } from '../settings/entities/settings.entity';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@Injectable()
export class BackupService {
  constructor(private readonly dataSource: DataSource) {}

  async restore(restoreBackupDto: RestoreBackupDto) {
    return this.dataSource.transaction(async (manager) => {
      await manager.clear(Income);
      await manager.clear(Expense);
      await manager.clear(Settings);
      // Transaction IDs are intentionally regenerated during restore.
      // The frontend replaces its state with the saved records returned below.
      const incomes = manager.create(
        Income,
        restoreBackupDto.incomes.map((item) => ({
          text: item.text,
          amount: item.amount,
          date: item.date,
        })),
      );

      const expenses = manager.create(
        Expense,
        restoreBackupDto.expenses.map((item) => ({
          text: item.text,
          amount: item.amount,
          date: item.date,
        })),
      );
      const settings = manager.create(Settings, {
        id: 1,
        openingBalance: restoreBackupDto.openingBalance,
        incomeSources: restoreBackupDto.incomeSources,
        expenseSources: restoreBackupDto.expenseSources,
        monthlyBudgets: restoreBackupDto.monthlyBudgets,
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
