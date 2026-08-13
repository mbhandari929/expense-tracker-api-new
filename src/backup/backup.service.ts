import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';
import type { CreateTransactionDto } from '../common/dto/create-transaction.dto';
import { Expense } from '../expense/entities/expense.entity';
import { Income } from '../income/entities/income.entity';
import { Settings } from '../settings/entities/settings.entity';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@Injectable()
export class BackupService {
  constructor(private readonly dataSource: DataSource) {}

  async restore(restoreBackupDto: RestoreBackupDto, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      await this.deleteUserData(manager, Income, userId);
      await this.deleteUserData(manager, Expense, userId);
      await this.deleteUserData(manager, Settings, userId);

      const incomes = manager.create(
        Income,
        this.mapTransactionsForUser(restoreBackupDto.incomes, userId),
      );

      const expenses = manager.create(
        Expense,
        this.mapTransactionsForUser(restoreBackupDto.expenses, userId),
      );

      const settings = manager.create(Settings, {
        openingBalance: restoreBackupDto.openingBalance,
        incomeSources: restoreBackupDto.incomeSources,
        expenseSources: restoreBackupDto.expenseSources,
        monthlyBudgets: restoreBackupDto.monthlyBudgets,
        user: { id: userId },
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

  private async deleteUserData<T extends ObjectLiteral>(
    manager: EntityManager,
    entity: EntityTarget<T>,
    userId: number,
  ): Promise<void> {
    await manager
      .getRepository(entity)
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .execute();
  }

  private mapTransactionsForUser(
    transactions: CreateTransactionDto[],
    userId: number,
  ) {
    return transactions.map(({ text, amount, date }) => ({
      text,
      amount,
      date,
      user: { id: userId },
    }));
  }
}
