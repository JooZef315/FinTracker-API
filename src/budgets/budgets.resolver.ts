import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BudgetsService } from './budgets.service';
import { ParseEnumPipe, ParseUUIDPipe } from '@nestjs/common/pipes';
import { userExistsPipe } from 'src/common/pipes/userExists.pipe';
import { UsePipes } from '@nestjs/common';
import { BudgetStatus, ExpenseCategory } from 'src/common/enums';
import { CreateBudgetDto } from './dto/createBudgetDto';
import { EditBudgetDto } from './dto/editBudgetDto';
import { budgetExistsPipe } from 'src/common/pipes/budgetExists.pipe';

@Resolver()
export class BudgetsResolver {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Query('budgets')
  getBudgets(
    @Args('id', ParseUUIDPipe) id: string,
    @Args(
      'category',
      new ParseEnumPipe(ExpenseCategory, {
        optional: true,
      }),
    )
    category: ExpenseCategory,
    @Args(
      'status',
      new ParseEnumPipe(BudgetStatus, {
        optional: true,
      }),
    )
    status: BudgetStatus,
  ) {
    return this.budgetsService.getBudgets(id, category, status);
  }

  @Query('budget')
  @UsePipes(userExistsPipe, budgetExistsPipe)
  getBudget(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('budgetId', ParseUUIDPipe) budgetId: string,
  ) {
    return this.budgetsService.getBudget(id, budgetId);
  }

  @Mutation('createBudget')
  @UsePipes(userExistsPipe)
  createBudget(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('newBudget') createBudgetDto: CreateBudgetDto,
  ) {
    return this.budgetsService.createBudget(id, createBudgetDto);
  }

  @Mutation('editBudget')
  @UsePipes(userExistsPipe, budgetExistsPipe)
  editBudget(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('budgetId', ParseUUIDPipe) budgetId: string,
    @Args('budgetData') editBudgetDto: EditBudgetDto,
  ) {
    return this.budgetsService.editBudget(id, budgetId, editBudgetDto);
  }

  @Mutation('deleteBudget')
  @UsePipes(userExistsPipe, budgetExistsPipe)
  deleteBudget(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('budgetId', ParseUUIDPipe) budgetId: string,
  ) {
    return this.budgetsService.deleteBudget(id, budgetId);
  }
}
