import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  create(createIncomeDto: CreateIncomeDto) {
    const income = this.incomeRepository.create(createIncomeDto);
    return this.incomeRepository.save(income);
  }

  findAll() {
    return this.incomeRepository.find();
  }

  findOne(id: number) {
    return this.incomeRepository.findOneBy({ id });
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    return this.incomeRepository.update(id, updateIncomeDto);
  }

  remove(id: number) {
    return this.incomeRepository.delete(id);
  }
}