import { Test, TestingModule } from '@nestjs/testing';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';

describe('IncomeController', () => {
  let controller: IncomeController;

  const incomeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const currentUser: AuthenticatedRequest['user'] = {
    sub: 7,
    email: 'test@example.com',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeController],
      providers: [
        {
          provide: IncomeService,
          useValue: incomeService,
        },
      ],
    }).compile();

    controller = module.get<IncomeController>(IncomeController);
  });

  it('creates income for the current user', async () => {
    const dto: CreateIncomeDto = {
      text: 'Salary',
      amount: 200000,
      date: '2026-08-13',
    };

    const result = {
      id: 1,
      ...dto,
    };

    incomeService.create.mockResolvedValue(result);

    await expect(controller.create(dto, currentUser)).resolves.toEqual(result);

    expect(incomeService.create).toHaveBeenCalledWith(dto, currentUser.sub);
  });

  it('returns all incomes for the current user', async () => {
    const result = [
      {
        id: 1,
        text: 'Salary',
        amount: 200000,
        date: '2026-08-13',
      },
    ];

    incomeService.findAll.mockResolvedValue(result);

    await expect(controller.findAll(currentUser)).resolves.toEqual(result);

    expect(incomeService.findAll).toHaveBeenCalledWith(currentUser.sub);
  });

  it('returns one income for the current user', async () => {
    const result = {
      id: 1,
      text: 'Salary',
      amount: 200000,
      date: '2026-08-13',
    };

    incomeService.findOne.mockResolvedValue(result);

    await expect(controller.findOne(1, currentUser)).resolves.toEqual(result);

    expect(incomeService.findOne).toHaveBeenCalledWith(1, currentUser.sub);
  });

  it('updates income for the current user', async () => {
    const dto: UpdateIncomeDto = {
      amount: 250000,
    };

    const result = {
      id: 1,
      text: 'Salary',
      amount: 250000,
      date: '2026-08-13',
    };

    incomeService.update.mockResolvedValue(result);

    await expect(controller.update(1, dto, currentUser)).resolves.toEqual(
      result,
    );

    expect(incomeService.update).toHaveBeenCalledWith(1, dto, currentUser.sub);
  });

  it('removes income for the current user', async () => {
    const result = {
      deleted: true,
    };

    incomeService.remove.mockResolvedValue(result);

    await expect(controller.remove(1, currentUser)).resolves.toEqual(result);

    expect(incomeService.remove).toHaveBeenCalledWith(1, currentUser.sub);
  });
});
