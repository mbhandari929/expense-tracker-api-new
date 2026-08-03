import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

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
  @IsObject()
  monthlyBudgets?: Record<string, number>;
}