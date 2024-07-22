/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { CreateBudgetDto } from './createBudgetDto';

export class EditBudgetDto extends PartialType(
  OmitType(CreateBudgetDto, ['budgetCategory'] as const),
) {}
