/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserInput } from 'src/common/graphqlDefinitions';

export class CreateUserDto extends CreateUserInput {
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(50)
  bio: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  balance: number;
}
