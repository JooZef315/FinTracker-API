import { Injectable } from '@nestjs/common';
import { BudgetStatus, ExpenseCategory } from 'src/common/enums';
import { Budget } from 'src/common/graphqlDefinitions';
import { DbService } from 'src/db/db.service';
import { CreateBudgetDto } from './dto/createBudgetDto';
import { EditBudgetDto } from './dto/editBudgetDto';
import { budgets } from 'drizzle/schema';

@Injectable()
export class BudgetsService {
  constructor(private dbService: DbService) {}

  async getBudgets(
    id: string,
    category: ExpenseCategory,
    status: BudgetStatus,
  ): Promise<Budget[]> {
    console.log(id, category, status);
    return [];
  }

  async getBudget(id: string, budgetId: string): Promise<Budget> {
    console.log(id, budgetId);
    return;
  }

  async createBudget(
    id: string,
    createBudgetDto: CreateBudgetDto,
  ): Promise<Budget> {
    console.log(id, createBudgetDto);

    const budget = await this.dbService.db
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

    console.log(budget[0]);
    // return budget[0];
    return;
  }

  async editBudget(
    id: string,
    budgetId: string,
    editBudgetDto: EditBudgetDto,
  ): Promise<Budget> {
    console.log(id, budgetId, editBudgetDto);
    return;
  }
  async deleteBudget(id: string, budgetId: string): Promise<string> {
    return `Budget with ${budgetId} was deleted successfully!`;
  }
}
