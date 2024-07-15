import { AppService } from './app.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query()
  ok(@Args('name') name: string) {
    return this.appService.getHello(name);
  }
}
