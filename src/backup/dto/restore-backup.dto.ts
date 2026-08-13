import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateTransactionDto } from '../../common/dto/create-transaction.dto';
import { IsMonthlyBudgets } from '../../common/validators/is-monthly-budgets.validator';

export class RestoreBackupDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  incomes!: CreateTransactionDto[];

  @IsArray()
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
