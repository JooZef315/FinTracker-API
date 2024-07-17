/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ExpenseCategory } from 'src/common/enums';
import { AddExpenseInput } from 'src/common/graphqlDefinitions';

export class AddExpenseDto extends AddExpenseInput {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;
}
