import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { IsMonthlyBudgets } from "../../common/validators/is-monthly-budgets.validator";

export class UpdateSettingsDto {
  @IsOptional()
  @IsNumber()
  openingBalance?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  incomeSources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expenseSources?: string[];

  @IsOptional()
  @IsMonthlyBudgets()
  monthlyBudgets?: Record<string, number>;
}