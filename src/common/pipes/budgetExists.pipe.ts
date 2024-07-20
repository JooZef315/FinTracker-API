/* eslint-disable prettier/prettier */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { budgets } from 'drizzle/schema';
import { DbService } from 'src/db/db.service';

@Injectable()
export class budgetExistsPipe implements PipeTransform {
  constructor(private readonly dbService: DbService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data == 'budgetId') {
      const budget = await this.dbService.db
        .select()
        .from(budgets)
        .where(eq(budgets.id, value));

      if (!budget.length) {
        throw new BadRequestException('Budget id not vaild');
      }
    }
    return value;
  }
}
