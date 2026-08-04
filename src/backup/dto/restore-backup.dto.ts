import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";

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

  @IsObject()
  monthlyBudgets!: Record<string, number>;
}