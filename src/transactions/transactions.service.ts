import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { AddIncomeDto } from './dto/addIncomeDto';
import { AddExpenseDto } from './dto/AddExpenseDto';
import { Expense, Income } from 'src/common/graphqlDefinitions';
import { budgets, expenses, incomes, users } from 'drizzle/schema';
import { and, count, desc, eq, gt, gte, lt, lte, sql, sum } from 'drizzle-orm';
import {
  BudgetStatus,
  ExpenseCategory,
  IncomeCategory,
} from 'src/common/enums';
import { getDate } from 'src/common/utils/dateUtils';

@Injectable()
export class TransactionsService {
  constructor(private dbService: DbService) {}

  async getIncome(
    id: string,
    ITEMS_PER_PAGE: number,
    page: number,
    source: IncomeCategory,
    before: string,
    after: string,
  ): Promise<Income[]> {
    const incomesCount = await this.dbService.db
      .select({ count: count(incomes.id) })
      .from(incomes)
      .where(
        and(
          eq(incomes.userId, id),
          source && eq(incomes.source, source),
          before && lt(incomes.createdAt, before),
          after && gt(incomes.createdAt, after),
        ),
      );

    const totalIncomesCount = incomesCount[0].count;
    const totalPagesCount = Math.ceil(totalIncomesCount / ITEMS_PER_PAGE);

    if ((page > totalPagesCount && totalPagesCount > 0) || page < 1) {
      throw new BadRequestException(
        `only pages between 1 and ${totalPagesCount} allowed`,
      );
    }

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
      .where(
        and(
          and(
            eq(incomes.userId, id),
            source && eq(incomes.source, source),
            before && lt(incomes.createdAt, before),
            after && gt(incomes.createdAt, after),
          ),
        ),
      )
      .orderBy(desc(incomes.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset((page - 1) * ITEMS_PER_PAGE);

    return userIncomes as unknown as Income[];
  }

  async getExpense(
    id: string,
    ITEMS_PER_PAGE: number,
    page: number,
    category: ExpenseCategory,
    before: string,
    after: string,
  ): Promise<Expense[]> {
    const expensesCount = await this.dbService.db
      .select({ count: count(expenses.id) })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, id),
          category && eq(expenses.category, category),
          before && lt(expenses.createdAt, before),
          after && gt(expenses.createdAt, after),
        ),
      );

    const totalExpensesCount = expensesCount[0].count;
    const totalPagesCount = Math.ceil(totalExpensesCount / ITEMS_PER_PAGE);

    if ((page > totalPagesCount && totalPagesCount > 0) || page < 1) {
      throw new BadRequestException(
        `only pages between 1 and ${totalPagesCount} allowed`,
      );
    }

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
      .where(
        and(
          eq(expenses.userId, id),
          category && eq(expenses.category, category),
          before && lt(expenses.createdAt, before),
          after && gt(expenses.createdAt, after),
        ),
      )
      .orderBy(desc(expenses.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset((page - 1) * ITEMS_PER_PAGE);

    return userExpenses as unknown as Expense[];
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

    // add to a proper budget
    const budget = await this.dbService.db
      .select({
        id: budgets.id,
        limit: budgets.limit,
        overLimit: budgets.overLimit,
      })
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, id),
          eq(budgets.budgetCategory, addExpenseDto.category),
          lte(budgets.startDate, getDate()),
          gte(budgets.endDate, getDate()),
        ),
      );

    const expenseToAdd = await this.dbService.db
      .insert(expenses)
      .values({
        userId: id,
        balanceAfter: user[0].balance - addExpenseDto.amount,
        ...addExpenseDto,
        budgetId: budget.length ? budget[0].id : null,
      })
      .returning();

    //upadte corresponding budget
    if (budget.length) {
      //get new amount spent in the updated budget
      const expensesaAmount = await this.dbService.db
        .select({
          amount: sum(expenses.amount),
        })
        .from(expenses)
        .where(eq(expenses.budgetId, budget[0].id));

      const amount = parseFloat(expensesaAmount[0].amount);

      //get new Over Limit in the updated budget
      const newOverLimit =
        budget[0].limit < amount ? amount - budget[0].limit : 0;

      const newStatus =
        newOverLimit == 0 ? BudgetStatus.IN_LIMIT : BudgetStatus.EXCEEDED;

      await this.dbService.db
        .update(budgets)
        .set({
          overLimit: newOverLimit,
          status: newStatus,
        })
        .where(eq(budgets.id, budget[0].id));
    }

    return expenseToAdd[0] as unknown as Expense;
  }
}
