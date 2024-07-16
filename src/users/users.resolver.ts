import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { ParseUUIDPipe, UsePipes } from '@nestjs/common';
import { EditUserDto } from './dto/editUserDto';
import { userExistsPipe } from 'src/common/pipes/userExists.pipe';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('user')
  getUser(@Args('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUser(id);
  }

  @Mutation('createUser')
  createUser(@Args('newUser') createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Mutation('editUser')
  @UsePipes(userExistsPipe)
  editUser(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('userData') editUserDto: EditUserDto,
  ) {
    return this.usersService.editUser(id, editUserDto);
  }

  @Mutation('deleteUser')
  @UsePipes(userExistsPipe)
  deleteUser(@Args('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
