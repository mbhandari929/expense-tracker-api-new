import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateTransactionDto } from '../../common/dto/create-transaction.dto';
import { IsMonthlyBudgets } from '../../common/validators/is-monthly-budgets.validator';

const MAX_BACKUP_TRANSACTIONS = 1000;

export class RestoreBackupDto {
  @IsArray()
  @ArrayMaxSize(MAX_BACKUP_TRANSACTIONS)
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  incomes!: CreateTransactionDto[];

  @IsArray()
  @ArrayMaxSize(MAX_BACKUP_TRANSACTIONS)
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  expenses!: CreateTransactionDto[];

  @IsNumber()
  openingBalance!: number;

  @IsArray()
  @IsString({ each: true })
  incomeSources!: string[];

  @IsArray()
  @IsString({ each: true })
  expenseSources!: string[];

  @IsMonthlyBudgets()
  monthlyBudgets!: Record<string, number>;
}