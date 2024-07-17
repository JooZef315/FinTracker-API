import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { AddIncomeDto } from './dto/addIncomeDto';
import { AddExpenseDto } from './dto/AddExpenseDto';
import { Expense, Income } from 'src/common/graphqlDefinitions';
import { expenses, incomes, users } from 'drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { ExpenseCategory } from 'src/common/enums';

@Injectable()
export class TransactionsService {
  constructor(private dbService: DbService) {}

  async getIncome(id: string): Promise<Income[]> {
    const userIncomes = await this.dbService.db
      .select({
        id: incomes.id,
        userId: incomes.userId,
        amount: incomes.amount,
        source: incomes.source,
        balanceAfter: incomes.balanceAfter,
        createdAt: incomes.createdAt,
      })
      .from(incomes)
      .where(eq(incomes.userId, id));

    return userIncomes.reverse() as unknown as Income[];
  }

  async getExpense(
    id: string,
    page: number,
    category: ExpenseCategory,
    before: string,
  ): Promise<Expense[]> {
    const userExpenses = await this.dbService.db
      .select({
        id: expenses.id,
        userId: expenses.userId,
        amount: expenses.amount,
        category: expenses.category,
        balanceAfter: expenses.balanceAfter,
        budgetId: expenses.budgetId,
        createdAt: expenses.createdAt,
      })
      .from(expenses)
      .where(eq(expenses.userId, id));

    return userExpenses.reverse() as unknown as Expense[];
  }

  async addIncome(id: string, addIncomeDto: AddIncomeDto): Promise<Income> {
    const updatedbalance = await this.dbService.db
      .update(users)
      .set({
        balance: sql`${users.balance} + ${addIncomeDto.amount}`,
      })
      .where(eq(users.id, id))
      .returning({ balance: users.balance });

    const incomeToAdd = await this.dbService.db
      .insert(incomes)
      .values({
        userId: id,
        amount: addIncomeDto.amount,
        source: addIncomeDto.source,
        balanceAfter: updatedbalance[0].balance,
      })
      .returning();

    return incomeToAdd[0] as unknown as Income;
  }

  async addExpense(id: string, addExpenseDto: AddExpenseDto): Promise<Expense> {
    const user = await this.dbService.db
      .select({
        balance: users.balance,
      })
      .from(users)
      .where(eq(users.id, id));

    if (user[0].balance < addExpenseDto.amount) {
      throw new BadRequestException(
        'Your Balance is lass than the Amount You want to Spend',
      );
    }
    await this.dbService.db
      .update(users)
      .set({
        balance: sql`${users.balance} - ${addExpenseDto.amount}`,
      })
      .where(eq(users.id, id));

    const expenseToAdd = await this.dbService.db
      .insert(expenses)
      .values({
        userId: id,
        balanceAfter: user[0].balance - addExpenseDto.amount,
        ...addExpenseDto,
      })
      .returning();

    return expenseToAdd[0] as unknown as Expense;
  }
}
