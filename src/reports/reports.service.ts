import { Injectable } from '@nestjs/common';
import { count, eq, sum } from 'drizzle-orm';
import { budgets, expenses, incomes, users } from 'drizzle/schema';
import { Report } from 'src/common/graphqlDefinitions';
import { groupByMonth } from 'src/common/utils/groupByMonth';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ReportsService {
  constructor(private dbService: DbService) {}

  async getUserReport(id: string): Promise<Report> {
    //get user details
    const user = await this.dbService.db
      .select({
        userId: users.id,
        name: users.name,
        Current_Balance: users.balance,
        Total_Income: sum(incomes.amount),
      })
      .from(users)
      .where(eq(users.id, id))
      .leftJoin(incomes, eq(incomes.userId, id))
      .groupBy(users.id);

    //get expenses Per Category
    const totalExpensePerCategory = await this.dbService.db
      .select({
        amount: sum(expenses.amount),
        category: expenses.category,
      })
      .from(expenses)
      .where(eq(expenses.userId, id))
      .groupBy(expenses.category);

    const Total_Spending =
      totalExpensePerCategory.length == 0
        ? 0
        : totalExpensePerCategory.reduce((total, e) => {
            return total + parseFloat(e.amount);
          }, 0);

    //Budgets
    const budgets_Per_status = await this.dbService.db
      .select({
        status: budgets.status,
        Number_Of_budgets: count(budgets.id),
      })
      .from(budgets)
      .where(eq(budgets.userId, id))
      .groupBy(budgets.status);

    //Expenses per month
    const userExpenses = await this.dbService.db
      .select({
        createdAt: expenses.createdAt,
        amount: expenses.amount,
      })
      .from(expenses)
      .where(eq(expenses.userId, id));

    const expenses_Per_Month = groupByMonth(userExpenses);

    const report = {
      ...user[0],
      Total_Income: user[0].Total_Income ? parseFloat(user[0].Total_Income) : 0,
      Total_Spending,
      Spending_Per_Category: totalExpensePerCategory,
      budgets_Per_status,
      expenses_Per_Month,
    } as unknown as Report;

    return report;
  }
}
