/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { IncomeCategory } from 'src/common/enums';
import { AddIncomeInput } from 'src/common/graphqlDefinitions';

export class AddIncomeDto extends AddIncomeInput {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsEnum(IncomeCategory)
  source: IncomeCategory;
}
