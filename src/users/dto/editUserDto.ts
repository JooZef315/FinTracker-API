import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto';
import { OmitType } from '@nestjs/swagger';

export class EditUserDto extends PartialType(
  OmitType(CreateUserDto, ['balance'] as const),
) {}
