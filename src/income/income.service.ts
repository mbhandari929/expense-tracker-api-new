import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  create(createIncomeDto: CreateIncomeDto, userId: number) {
    const income = this.incomeRepository.create({
      ...createIncomeDto,
      user: { id: userId } as User,
    });

    return this.incomeRepository.save(income);
  }

  findAll(userId: number) {
    return this.incomeRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const income = await this.incomeRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!income) {
      throw new NotFoundException(`Income with ID ${id} not found`);
    }

    return income;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto, userId: number) {
    const income = await this.findOne(id, userId);

    Object.assign(income, updateIncomeDto);

    return this.incomeRepository.save(income);
  }

  async remove(id: number, userId: number) {
    const income = await this.findOne(id, userId);

    return this.incomeRepository.remove(income);
  }
}
