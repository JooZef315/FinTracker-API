/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ExpenseCategory } from 'src/common/enums';
import { CreateBudgetInput } from 'src/common/graphqlDefinitions';

export class CreateBudgetDto extends CreateBudgetInput {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  limit: number;

  @IsNotEmpty()
  @IsEnum(ExpenseCategory)
  budgetCategory: ExpenseCategory;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(50)
  description: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: Date;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate: Date;
}
