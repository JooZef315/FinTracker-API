import { Args, Query, Resolver } from '@nestjs/graphql';
import { ReportsService } from './reports.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/role.decorator';

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtGuard)
  @Query('report')
  getUserReport(@Args('id') id: string, @CurrentUser() user: JwtPayload) {
    console.log(user);
    return this.reportsService.getUserReport(user.userId);
  }
}
