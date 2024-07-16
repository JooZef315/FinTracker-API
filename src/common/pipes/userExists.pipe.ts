/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import { DbService } from 'src/db/db.service';

@Injectable()
export class userExistsPipe implements PipeTransform {
  constructor(private readonly dbService: DbService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.data == 'id') {
      const user = await this.dbService.db
        .select()
        .from(users)
        .where(eq(users.id, value));

      if (!user.length) {
        throw new BadRequestException('User id not vaild');
      }
    }
    return value;
  }
}
