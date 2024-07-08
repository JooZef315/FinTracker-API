import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import { SavingsModule } from './savings/savings.module';
import { ReportsModule } from './reports/reports.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TransactionsModule,
    BudgetsModule,
    SavingsModule,
    ReportsModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
