import { Test, TestingModule } from '@nestjs/testing';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { RestoreBackupDto } from './dto/restore-backup.dto';

describe('BackupController', () => {
  let controller: BackupController;

  const backupServiceMock = {
    restore: jest.fn(),
  };

  const currentUser: AuthenticatedRequest['user'] = {
    sub: 7,
    email: 'test@example.com',
  };

  const restoreBackupDto: RestoreBackupDto = {
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

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackupController],
      providers: [
        {
          provide: BackupService,
          useValue: backupServiceMock,
        },
      ],
    }).compile();

    controller = module.get<BackupController>(BackupController);
  });

  describe('restore', () => {
    it('restores backup data for the current user', async () => {
      const restoredData = {
        message: 'Backup restored successfully',
        incomes: restoreBackupDto.incomes,
        expenses: restoreBackupDto.expenses,
        settings: {
          openingBalance: restoreBackupDto.openingBalance,
          incomeSources: restoreBackupDto.incomeSources,
          expenseSources: restoreBackupDto.expenseSources,
          monthlyBudgets: restoreBackupDto.monthlyBudgets,
        },
      };

      backupServiceMock.restore.mockResolvedValue(restoredData);

      const result = await controller.restore(restoreBackupDto, currentUser);

      expect(result).toEqual(restoredData);

      expect(backupServiceMock.restore).toHaveBeenCalledWith(
        restoreBackupDto,
        currentUser.sub,
      );

      expect(backupServiceMock.restore).toHaveBeenCalledTimes(1);
    });

    it('propagates an error when restore fails', async () => {
      backupServiceMock.restore.mockRejectedValue(new Error('Restore failed'));

      await expect(
        controller.restore(restoreBackupDto, currentUser),
      ).rejects.toThrow('Restore failed');

      expect(backupServiceMock.restore).toHaveBeenCalledWith(
        restoreBackupDto,
        currentUser.sub,
      );
    });
  });
});
