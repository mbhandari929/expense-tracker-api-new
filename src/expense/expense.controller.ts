import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.expenseService.create(createExpenseDto, user.sub);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedRequest['user']) {
    return this.expenseService.findAll(user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.expenseService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.expenseService.update(id, updateExpenseDto, user.sub);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.expenseService.remove(id, user.sub);
  }
}
