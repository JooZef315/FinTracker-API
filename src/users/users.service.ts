import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { users } from 'drizzle/schema';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from './dto/createUserDto';
import { and, eq, ne } from 'drizzle-orm';
import { User } from 'src/common/graphqlDefinitions';
import { EditUserDto } from './dto/editUserDto';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}
  async getUser(id: string): Promise<User> {
    const user = await this.dbService.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        bio: users.bio,
        balance: users.balance,
      })
      .from(users)
      .where(eq(users.id, id));

    if (!user.length) {
      throw new BadRequestException('user not found');
    }

    return user[0] as User;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.dbService.db
      .insert(users)
      .values({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashPassword,
        bio: createUserDto.bio,
        balance: createUserDto.balance,
      })
      .returning();

    return user[0] as User;
  }

  async editUser(id: string, editUserDto: EditUserDto): Promise<User> {
    const updatedData: EditUserDto = {};

    if (editUserDto.email) {
      const existedWithSameUsername = await this.dbService.db
        .select()
        .from(users)
        .where(and(eq(users.email, editUserDto.email), ne(users.id, id)));

      if (existedWithSameUsername.length) {
        throw new BadRequestException('Email already taken');
      }
      updatedData.email = editUserDto.email;
    }

    if (editUserDto.password) {
      const newHashedPassword = await bcrypt.hash(editUserDto.password, 10);
      updatedData.password = newHashedPassword;
    }

    if (editUserDto.name) {
      updatedData.name = editUserDto.name;
    }

    if (editUserDto.bio) {
      updatedData.bio = editUserDto.bio;
    }

    const editedUser = await this.dbService.db
      .update(users)
      .set(updatedData)
      .where(eq(users.id, id))
      .returning();

    return editedUser[0];
  }

  async deleteUser(id: string): Promise<string> {
    await this.dbService.db.delete(users).where(eq(users.id, id));

    return `User with ${id} was deleted successfully!`;
  }
}
