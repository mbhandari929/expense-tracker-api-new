import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateIncomeDto {
  @IsString()
  @IsNotEmpty()
text!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsDateString()
  date!: string;
}