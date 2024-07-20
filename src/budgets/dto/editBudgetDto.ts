/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { BudgetStatus } from 'src/common/enums';
import { CreateBudgetDto } from './createBudgetDto';

export class EditBudgetDto extends PartialType(
  OmitType(CreateBudgetDto, ['budgetCategory'] as const),
) {
  @IsString()
  @Matches('ARCHIVED')
  status: BudgetStatus.ARCHIVED;
}
