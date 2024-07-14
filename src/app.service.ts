import { Injectable } from '@nestjs/common';
import { DbService } from './db/db.service';
import { users } from 'drizzle/schema';

@Injectable()
export class AppService {
  constructor(private dbService: DbService) {}
  async getHello() {
    const x = await this.dbService.db.select().from(users);
    console.log(x);
    return 'Hello World!';
  }
}
