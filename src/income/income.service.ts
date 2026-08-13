import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserScopedRepository } from '../common/repositories/user-scoped.repository';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';

@Injectable()
export class IncomeService {
  private readonly userScopedRepository: UserScopedRepository<Income>;

  constructor(
    @InjectRepository(Income)
    incomeRepository: Repository<Income>,
  ) {
    this.userScopedRepository = new UserScopedRepository(
      incomeRepository,
      'Income',
    );
  }

  create(createIncomeDto: CreateIncomeDto, userId: number) {
    return this.userScopedRepository.create(createIncomeDto, userId);
  }

  findAll(userId: number) {
    return this.userScopedRepository.findAll(userId);
  }

  findOne(id: number, userId: number) {
    return this.userScopedRepository.findOne(id, userId);
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto, userId: number) {
    return this.userScopedRepository.update(id, updateIncomeDto, userId);
  }

  remove(id: number, userId: number) {
    return this.userScopedRepository.remove(id, userId);
  }
}
