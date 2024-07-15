import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('user')
  getUser() {
    return this.usersService.getUser();
  }

  @Mutation('createUser')
  createUser(@Args('newUser') createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
