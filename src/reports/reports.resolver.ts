import { Args, Query, Resolver } from '@nestjs/graphql';
import { ReportsService } from './reports.service';

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Query('report')
  getUserReport(@Args('id') id: string) {
    return this.reportsService.getUserReport(id);
  }
}
