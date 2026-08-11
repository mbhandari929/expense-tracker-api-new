import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  create(createExpenseDto: CreateExpenseDto, userId: number) {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user: { id: userId } as User,
    });

    return this.expenseRepository.save(expense);
  }

  findAll(userId: number) {
    return this.expenseRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const expense = await this.expenseRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number) {
    const expense = await this.findOne(id, userId);

    Object.assign(expense, updateExpenseDto);

    return this.expenseRepository.save(expense);
  }

  async remove(id: number, userId: number) {
    const expense = await this.findOne(id, userId);

    return this.expenseRepository.remove(expense);
  }
}
