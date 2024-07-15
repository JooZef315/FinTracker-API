import { Injectable } from '@nestjs/common';
import { users } from 'drizzle/schema';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}
  async getUser() {
    const user = await this.dbService.db.select().from(users);
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return createUserDto;
  }
}
