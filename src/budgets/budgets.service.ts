import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BudgetStatus, ExpenseCategory } from 'src/common/enums';
import { Budget, Expense } from 'src/common/graphqlDefinitions';
import { DbService } from 'src/db/db.service';
import { CreateBudgetDto } from './dto/createBudgetDto';
import { EditBudgetDto } from './dto/editBudgetDto';
import { budgets, expenses } from 'drizzle/schema';
import { and, eq, gt, gte, isNull, lt, lte, or, sum } from 'drizzle-orm';
import { comapreDates } from 'src/common/utils/dateUtils';

@Injectable()
export class BudgetsService {
  constructor(private dbService: DbService) {}

  async getBudgets(
    id: string,
    category: ExpenseCategory,
    status: BudgetStatus,
  ): Promise<Budget[]> {
    const userBudgets = await this.dbService.db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, id),
          category && eq(budgets.budgetCategory, category),
          status && eq(budgets.status, status),
        ),
      );
    return userBudgets as unknown as Budget[];
  }

  async getBudget(id: string, budgetId: string): Promise<Budget> {
    const budget = await this.dbService.db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, budgetId), eq(budgets.userId, id)));

    if (budget.length < 1) {
      throw new BadRequestException('User has no Budgets');
    }

    return budget[0] as unknown as Budget;
  }

  async createBudget(
    id: string,
    createBudgetDto: CreateBudgetDto,
  ): Promise<Budget> {
    if (!comapreDates(createBudgetDto.startDate, createBudgetDto.endDate)) {
      throw new BadRequestException(
        'Starting date is AFTER Ending date of the Budget',
      );
    }

    const newBudget = await this.dbService.db
      .insert(budgets)
      .values({
        userId: id,
        budgetCategory: createBudgetDto.budgetCategory,
        limit: createBudgetDto.limit,
        description: createBudgetDto.description,
        startDate:
          createBudgetDto.startDate && String(createBudgetDto.startDate),
        endDate: createBudgetDto.endDate && String(createBudgetDto.endDate),
      })
      .returning();

    const budgetExpenses = await this.dbService.db
      .update(expenses)
      .set({
        budgetId: newBudget[0].id,
      })
      .where(
        and(
          eq(expenses.userId, id),
          isNull(expenses.budgetId),
          eq(expenses.category, newBudget[0].budgetCategory),
          gte(expenses.createdAt, newBudget[0].startDate),
          lte(expenses.createdAt, newBudget[0].endDate),
        ),
      )
      .returning();

    let amount = 0;
    if (budgetExpenses.length > 0) {
      amount = budgetExpenses.reduce((total, e) => {
        return total + e.amount;
      }, 0);

      if (amount >= newBudget[0].limit) {
        await this.dbService.db
          .update(budgets)
          .set({
            status: BudgetStatus.EXCEEDED,
            overLimit: amount - newBudget[0].limit,
          })
          .where(eq(budgets.id, newBudget[0].id));

        newBudget[0].status = BudgetStatus.EXCEEDED;
        newBudget[0].overLimit = amount - newBudget[0].limit;
      } else {
        await this.dbService.db
          .update(budgets)
          .set({
            status: BudgetStatus.IN_LIMIT,
          })
          .where(eq(budgets.id, newBudget[0].id));

        newBudget[0].status = BudgetStatus.IN_LIMIT;
      }
    }

    return newBudget[0] as unknown as Budget;
  }

  async editBudget(
    id: string,
    budgetId: string,
    editBudgetDto: EditBudgetDto,
  ): Promise<Budget> {
    const budgetToUpdate = await this.dbService.db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, budgetId), eq(budgets.userId, id)));

    if (budgetToUpdate.length < 1) {
      throw new ForbiddenException('access to this Budget is Forbidden.');
    }

    if (budgetToUpdate[0].status == BudgetStatus.ARCHIVED) {
      throw new ForbiddenException('Forbidden. This Budget is ARCHIVED.');
    }

    if (
      !comapreDates(
        editBudgetDto.startDate,
        editBudgetDto.endDate,
        budgetToUpdate[0].startDate,
        budgetToUpdate[0].endDate,
      )
    ) {
      throw new BadRequestException(
        'Starting date is AFTER Ending date of the Budget',
      );
    }

    //Add from budget
    await this.dbService.db
      .update(expenses)
      .set({
        budgetId,
      })
      .where(
        and(
          eq(expenses.userId, id),
          isNull(expenses.budgetId),
          eq(expenses.category, budgetToUpdate[0].budgetCategory),
          editBudgetDto.startDate &&
            gte(expenses.createdAt, String(editBudgetDto.startDate)),
          editBudgetDto.endDate &&
            lte(expenses.createdAt, String(editBudgetDto.endDate)),
        ),
      );

    //Remove from budget
    await this.dbService.db
      .update(expenses)
      .set({
        budgetId: null,
      })
      .where(
        and(
          eq(expenses.budgetId, budgetId),
          or(
            editBudgetDto.startDate &&
              lt(expenses.createdAt, String(editBudgetDto.startDate)),
            editBudgetDto.endDate &&
              gt(expenses.createdAt, String(editBudgetDto.endDate)),
          ),
        ),
      );

    //get new amount spent in the updated budget
    const expensesaAmount = await this.dbService.db
      .select({
        amount: sum(expenses.amount),
      })
      .from(expenses)
      .where(eq(expenses.budgetId, budgetId));

    const amount = expensesaAmount[0].amount
      ? parseFloat(expensesaAmount[0].amount)
      : 0;

    //get new Over Limit in the updated budget
    const newOverLimit = editBudgetDto.limit
      ? Math.max(amount - editBudgetDto.limit, 0)
      : Math.max(amount - budgetToUpdate[0].limit, 0);

    const newStatus =
      amount == 0
        ? BudgetStatus.DRAFT
        : newOverLimit == 0
          ? BudgetStatus.IN_LIMIT
          : BudgetStatus.EXCEEDED;

    const updatedBudget = await this.dbService.db
      .update(budgets)
      .set({
        limit: editBudgetDto.limit,
        overLimit: newOverLimit,
        status: newStatus,
        description: editBudgetDto.description,
        startDate: editBudgetDto.startDate && String(editBudgetDto.startDate),
        endDate: editBudgetDto.endDate && String(editBudgetDto.endDate),
      })
      .where(and(eq(budgets.id, budgetId), eq(budgets.userId, id)))
      .returning();

    return updatedBudget[0] as unknown as Budget;
  }

  async deleteBudget(id: string, budgetId: string): Promise<string> {
    try {
      const deleteBudget = await this.dbService.db
        .delete(budgets)
        .where(and(eq(budgets.id, budgetId), eq(budgets.userId, id)))
        .returning();

      return `Budget with ${deleteBudget[0].id} was deleted successfully!`;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('access to this Budget is Forbidden.');
    }
  }

  async archiveBudget(id: string, budgetId: string): Promise<string> {
    try {
      const archivedBudget = await this.dbService.db
        .update(budgets)
        .set({
          status: BudgetStatus.ARCHIVED,
        })
        .where(and(eq(budgets.id, budgetId), eq(budgets.userId, id)))
        .returning();

      return `Budget with ${archivedBudget[0].id} was Archived successfully!`;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('access to this Budget is Forbidden.');
    }
  }

  async getBudgetExpenses(budgetId: string): Promise<Expense[]> {
    const BudgetExpenses = await this.dbService.db
      .select()
      .from(expenses)
      .where(eq(expenses.budgetId, budgetId));

    return BudgetExpenses as unknown as Expense[];
  }
}
