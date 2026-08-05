import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateIncomeDto } from "./dto/create-income.dto";
import { UpdateIncomeDto } from "./dto/update-income.dto";
import { Income } from "./entities/income.entity";

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

  async findOne(id: number) {
    const income = await this.incomeRepository.findOneBy({ id });

    if (!income) {
      throw new NotFoundException(`Income with ID ${id} not found`);
    }

    return income;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    const income = await this.incomeRepository.preload({
      id,
      ...updateIncomeDto,
    });

    if (!income) {
      throw new NotFoundException(`Income with ID ${id} not found`);
    }

    return this.incomeRepository.save(income);
  }

  async remove(id: number) {
    const income = await this.findOne(id);
    return this.incomeRepository.remove(income);
  }
}