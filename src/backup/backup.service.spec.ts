import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { Expense } from '../expense/entities/expense.entity';
import { Income } from '../income/entities/income.entity';
import { Settings } from '../settings/entities/settings.entity';
import { BackupService } from './backup.service';
import { RestoreBackupDto } from './dto/restore-backup.dto';

describe('BackupService', () => {
  let service: BackupService;

  const dataSourceMock = {
    transaction: jest.fn(),
  };

  const managerMock = {
    getRepository: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const backupData: RestoreBackupDto = {
    incomes: [
      {
        text: 'Salary',
        amount: 200000,
        date: '2026-08-13',
      },
    ],
    expenses: [
      {
        text: 'Food',
        amount: 5000,
        date: '2026-08-13',
      },
    ],
    openingBalance: 100000,
    incomeSources: ['Salary'],
    expenseSources: ['Food'],
    monthlyBudgets: {
      '2026-08': 50000,
    },
  };

  const createRepositoryMock = () => {
    const execute = jest.fn().mockResolvedValue({ affected: 1 });

    const where = jest.fn().mockReturnValue({
      execute,
    });

    const deleteQuery = jest.fn().mockReturnValue({
      where,
    });

    const createQueryBuilder = jest.fn().mockReturnValue({
      delete: deleteQuery,
    });

    return {
      createQueryBuilder,
      where,
    };
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const incomeRepository = createRepositoryMock();
    const expenseRepository = createRepositoryMock();
    const settingsRepository = createRepositoryMock();

    managerMock.getRepository.mockImplementation((entity: unknown) => {
      if (entity === Income) {
        return incomeRepository;
      }

      if (entity === Expense) {
        return expenseRepository;
      }

      if (entity === Settings) {
        return settingsRepository;
      }

      throw new Error('Unexpected repository');
    });

    managerMock.create.mockImplementation(
      (_entity: unknown, data: unknown): unknown => data,
    );

    managerMock.save.mockImplementation(
      (_entity: unknown, data: unknown): Promise<unknown> =>
        Promise.resolve(data),
    );

    dataSourceMock.transaction.mockImplementation(
      (callback: (manager: EntityManager) => Promise<unknown>) =>
        callback(managerMock as unknown as EntityManager),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupService,
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<BackupService>(BackupService);
  });

  it('restores backup data for the current user', async () => {
    const result = await service.restore(backupData, 7);

    expect(dataSourceMock.transaction).toHaveBeenCalledTimes(1);

    expect(managerMock.create).toHaveBeenCalledWith(Income, [
      {
        text: 'Salary',
        amount: 200000,
        date: '2026-08-13',
        user: { id: 7 },
      },
    ]);

    expect(managerMock.create).toHaveBeenCalledWith(Expense, [
      {
        text: 'Food',
        amount: 5000,
        date: '2026-08-13',
        user: { id: 7 },
      },
    ]);

    expect(managerMock.create).toHaveBeenCalledWith(Settings, {
      openingBalance: 100000,
      incomeSources: ['Salary'],
      expenseSources: ['Food'],
      monthlyBudgets: {
        '2026-08': 50000,
      },
      user: { id: 7 },
    });

    expect(managerMock.save).toHaveBeenCalledTimes(3);

    expect(result.message).toBe('Backup restored successfully');

    expect(result.incomes).toHaveLength(1);
    expect(result.expenses).toHaveLength(1);
    expect(result.settings.openingBalance).toBe(100000);
  });

  it('throws an error when saving restored data fails', async () => {
    managerMock.save.mockRejectedValueOnce(new Error('Save failed'));

    await expect(service.restore(backupData, 7)).rejects.toThrow('Save failed');
  });
});
