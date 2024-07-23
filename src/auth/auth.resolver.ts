import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginDto } from './dto/loginDto';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('login')
  login(@Args('data') loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
