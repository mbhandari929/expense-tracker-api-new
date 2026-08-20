import { Test, TestingModule } from '@nestjs/testing';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';

describe('ExpenseController', () => {
  let controller: ExpenseController;

  const expenseServiceMock = {
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

  const expense = {
    id: 1,
    text: 'Food',
    amount: 5000,
    date: '2026-08-13',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        {
          provide: ExpenseService,
          useValue: expenseServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ExpenseController>(ExpenseController);
  });

  describe('create', () => {
    it('creates an expense for the current user', async () => {
      const dto: CreateExpenseDto = {
        text: 'Food',
        amount: 5000,
        date: '2026-08-13',
      };

      expenseServiceMock.create.mockResolvedValue(expense);

      const result = await controller.create(dto, currentUser);

      expect(result).toEqual(expense);

      expect(expenseServiceMock.create).toHaveBeenCalledWith(
        dto,
        currentUser.sub,
      );
    });
  });

  describe('findAll', () => {
    it('returns expenses for the current user', async () => {
      expenseServiceMock.findAll.mockResolvedValue([expense]);

      const result = await controller.findAll(currentUser);

      expect(result).toEqual([expense]);

      expect(expenseServiceMock.findAll).toHaveBeenCalledWith(currentUser.sub);
    });
  });

  describe('findOne', () => {
    it('returns one expense for the current user', async () => {
      expenseServiceMock.findOne.mockResolvedValue(expense);

      const result = await controller.findOne(expense.id, currentUser);

      expect(result).toEqual(expense);

      expect(expenseServiceMock.findOne).toHaveBeenCalledWith(
        expense.id,
        currentUser.sub,
      );
    });
  });

  describe('update', () => {
    it('updates an expense for the current user', async () => {
      const dto: UpdateExpenseDto = {
        amount: 6000,
      };

      const updatedExpense = {
        ...expense,
        amount: 6000,
      };

      expenseServiceMock.update.mockResolvedValue(updatedExpense);

      const result = await controller.update(expense.id, dto, currentUser);

      expect(result).toEqual(updatedExpense);

      expect(expenseServiceMock.update).toHaveBeenCalledWith(
        expense.id,
        dto,
        currentUser.sub,
      );
    });
  });

  describe('remove', () => {
    it('removes an expense for the current user', async () => {
      expenseServiceMock.remove.mockResolvedValue(expense);

      const result = await controller.remove(expense.id, currentUser);

      expect(result).toEqual(expense);

      expect(expenseServiceMock.remove).toHaveBeenCalledWith(
        expense.id,
        currentUser.sub,
      );
    });
  });
});
