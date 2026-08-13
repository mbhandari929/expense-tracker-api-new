import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserScopedRepository } from '../common/repositories/user-scoped.repository';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpenseService {
  private readonly userScopedRepository: UserScopedRepository<Expense>;

  constructor(
    @InjectRepository(Expense)
    expenseRepository: Repository<Expense>,
  ) {
    this.userScopedRepository = new UserScopedRepository(
      expenseRepository,
      'Expense',
    );
  }

  create(createExpenseDto: CreateExpenseDto, userId: number) {
    return this.userScopedRepository.create(createExpenseDto, userId);
  }

  findAll(userId: number) {
    return this.userScopedRepository.findAll(userId);
  }

  findOne(id: number, userId: number) {
    return this.userScopedRepository.findOne(id, userId);
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number) {
    return this.userScopedRepository.update(id, updateExpenseDto, userId);
  }

  remove(id: number, userId: number) {
    return this.userScopedRepository.remove(id, userId);
  }
}
