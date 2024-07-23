import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { UseGuards } from '@nestjs/common';
import { EditUserDto } from './dto/editUserDto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/role.decorator';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Query('user')
  getUser(@CurrentUser() user: JwtPayload) {
    const id = user.userId;
    return this.usersService.getUser(id);
  }

  @Mutation('createUser')
  createUser(@Args('newUser') createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Mutation('editUser')
  editUser(
    @CurrentUser() user: JwtPayload,
    @Args('userData') editUserDto: EditUserDto,
  ) {
    const id = user.userId;
    return this.usersService.editUser(id, editUserDto);
  }

  @UseGuards(JwtGuard)
  @Mutation('deleteUser')
  deleteUser(@CurrentUser() user: JwtPayload) {
    const id = user.userId;
    return this.usersService.deleteUser(id);
  }
}
