/* eslint-disable prettier/prettier */
import { BadRequestException } from '@nestjs/common';
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import * as moment from 'moment';

@Scalar('Date')
export class DateScalar implements CustomScalar<string, string> {
  description = 'Date Scalar type (YYYY-MM-DD)';

  parseValue(value: string): string {
    // value from the client
    const date = moment(value, 'YYYY-MM-DD', true);
    if (!date.isValid()) {
      throw new Error('Invalid date format. Expected format: YYYY-MM-DD');
    }
    return date.format('YYYY-MM-DD');
  }

  serialize(value: string): string {
    // value sent to the client
    return moment(value).format('YYYY-MM-DD');
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      const value = ast.value;
      const date = moment(value, 'YYYY-MM-DD', true);
      if (!date.isValid()) {
        throw new BadRequestException(
          'Invalid date format. Expected format: YYYY-MM-DD',
        );
      }
      return date.format('YYYY-MM-DD');
    }
    throw new BadRequestException(
      'Invalid date format. Expected a string in format: YYYY-MM-DD',
    );
  }
}
