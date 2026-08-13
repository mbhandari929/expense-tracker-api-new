import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseService } from './expense.service';

describe('ExpenseService', () => {
  let service: ExpenseService;

  const expenseRepositoryMock = {
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
        ExpenseService,
        {
          provide: getRepositoryToken(Expense),
          useValue: expenseRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
  });

  it('creates an expense for the current user', async () => {
    const dto = {
      text: 'Food',
      amount: 5000,
      date: '2026-08-13',
    };

    const savedExpense = {
      id: 1,
      ...dto,
      user: { id: 7 },
    } as Expense;

    expenseRepositoryMock.create.mockReturnValue(savedExpense);

    expenseRepositoryMock.save.mockResolvedValue(savedExpense);

    const result = await service.create(dto, 7);

    expect(expenseRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      user: { id: 7 },
    });

    expect(expenseRepositoryMock.save).toHaveBeenCalledWith(savedExpense);

    expect(result).toEqual(savedExpense);
  });

  it('returns only expenses for the current user', async () => {
    expenseRepositoryMock.find.mockResolvedValue([]);

    const result = await service.findAll(7);

    expect(expenseRepositoryMock.find).toHaveBeenCalledWith({
      where: {
        user: {
          id: 7,
        },
      },
    });

    expect(result).toEqual([]);
  });
});
