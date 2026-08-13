import { Test, TestingModule } from '@nestjs/testing';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

describe('SettingsController', () => {
  let controller: SettingsController;

  const settingsServiceMock = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const currentUser: AuthenticatedRequest['user'] = {
    sub: 7,
    email: 'test@example.com',
  };

  const settings = {
    id: 1,
    openingBalance: 100000,
    incomeSources: ['Salary', 'Bonus'],
    expenseSources: ['Food', 'Rent'],
    monthlyBudgets: {
      '2026-08': 50000,
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: settingsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
  });

  describe('findOne', () => {
    it('returns settings for the current user', async () => {
      settingsServiceMock.findOne.mockResolvedValue(settings);

      const result = await controller.findOne(currentUser);

      expect(result).toEqual(settings);

      expect(settingsServiceMock.findOne).toHaveBeenCalledWith(currentUser.sub);

      expect(settingsServiceMock.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('updates settings for the current user', async () => {
      const dto: UpdateSettingsDto = {
        openingBalance: 150000,
        incomeSources: ['Salary', 'Bonus'],
        expenseSources: ['Food', 'Rent'],
        monthlyBudgets: {
          '2026-08': 60000,
        },
      };

      const updatedSettings = {
        ...settings,
        ...dto,
      };

      settingsServiceMock.update.mockResolvedValue(updatedSettings);

      const result = await controller.update(dto, currentUser);

      expect(result).toEqual(updatedSettings);

      expect(settingsServiceMock.update).toHaveBeenCalledWith(
        dto,
        currentUser.sub,
      );

      expect(settingsServiceMock.update).toHaveBeenCalledTimes(1);
    });
  });
});
