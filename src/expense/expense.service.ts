import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "./entities/expense.entity";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  create(createExpenseDto: CreateExpenseDto) {
    const expense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(expense);
  }

  findAll() {
    return this.expenseRepository.find();
  }

  async findOne(id: number) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException("Invalid expense ID");
    }

    const expense = await this.expenseRepository.findOneBy({ id });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException("Invalid expense ID");
    }

    const expense = await this.expenseRepository.preload({
      id,
      ...updateExpenseDto,
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return this.expenseRepository.save(expense);
  }

  async remove(id: number) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException("Invalid expense ID");
    }

    const expense = await this.findOne(id);

    return this.expenseRepository.remove(expense);
  }
}