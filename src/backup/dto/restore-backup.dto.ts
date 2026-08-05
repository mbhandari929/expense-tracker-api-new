import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { IsMonthlyBudgets } from "../../common/validators/is-monthly-budgets.validator";

class RestoreTransactionDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsDateString()
  date!: string;
}

export class RestoreBackupDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestoreTransactionDto)
  incomes!: RestoreTransactionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestoreTransactionDto)
  expenses!: RestoreTransactionDto[];

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