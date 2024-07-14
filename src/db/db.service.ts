/* eslint-disable prettier/prettier */
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type DbType = ReturnType<typeof drizzle>;

@Injectable()
export class DbService {
  readonly db: DbType;

  constructor(private config: ConfigService) {
    const DATABASE_URL = config.get<string>('TURSO_DATABASE_URL');
    const DATABASE_AUTH_TOKEN = config.get<string>('TURSO_AUTH_TOKEN');

    const client = createClient({
      url: DATABASE_URL,
      authToken: DATABASE_AUTH_TOKEN,
    });

    this.db = drizzle(client);
  }
}
