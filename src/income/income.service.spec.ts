import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { IncomeService } from './income.service';

describe('IncomeService', () => {
  let service: IncomeService;

  const incomeRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomeService,
        {
          provide: getRepositoryToken(Income),
          useValue: incomeRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<IncomeService>(IncomeService);
  });

  it('creates an income for the current user', async () => {
    const dto = {
      text: 'Salary',
      amount: 200000,
      date: '2026-08-13',
    };

    const savedIncome = {
      id: 1,
      ...dto,
      user: { id: 7 },
    } as Income;

    incomeRepositoryMock.create.mockReturnValue(savedIncome);

    incomeRepositoryMock.save.mockResolvedValue(savedIncome);

    const result = await service.create(dto, 7);

    expect(incomeRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      user: { id: 7 },
    });

    expect(incomeRepositoryMock.save).toHaveBeenCalledWith(savedIncome);

    expect(result).toEqual(savedIncome);
  });

  it('returns only incomes for the current user', async () => {
    incomeRepositoryMock.find.mockResolvedValue([]);

    const result = await service.findAll(7);

    expect(incomeRepositoryMock.find).toHaveBeenCalledWith({
      where: {
        user: {
          id: 7,
        },
      },
    });

    expect(result).toEqual([]);
  });
});
