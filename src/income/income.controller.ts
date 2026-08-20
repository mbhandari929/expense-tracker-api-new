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
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeService } from './income.service';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(
    @Body() createIncomeDto: CreateIncomeDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.incomeService.create(createIncomeDto, user.sub);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedRequest['user']) {
    return this.incomeService.findAll(user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.incomeService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.incomeService.update(id, updateIncomeDto, user.sub);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ) {
    return this.incomeService.remove(id, user.sub);
  }
}
