import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsInt()
  @IsPositive()
  amount!: number;

  @IsDateString()
  date!: string;
}