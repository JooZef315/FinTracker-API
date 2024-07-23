import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BudgetsService } from './budgets.service';
import { ParseEnumPipe, ParseUUIDPipe } from '@nestjs/common/pipes';
import { UseGuards, UsePipes } from '@nestjs/common';
import { BudgetStatus, ExpenseCategory } from 'src/common/enums';
import { CreateBudgetDto } from './dto/createBudgetDto';
import { EditBudgetDto } from './dto/editBudgetDto';
import { budgetExistsPipe } from 'src/common/pipes/budgetExists.pipe';
import { Budget } from 'src/common/graphqlDefinitions';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/role.decorator';

@Resolver('Budget')
export class BudgetsResolver {
  constructor(private readonly budgetsService: BudgetsService) {}

  @UseGuards(JwtGuard)
  @Query('budgets')
  getBudgets(
    @CurrentUser() user: JwtPayload,
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
    const id = user.userId;
    return this.budgetsService.getBudgets(id, category, status);
  }
  @UseGuards(JwtGuard)
  @UsePipes(budgetExistsPipe)
  @Query('budget')
  getBudget(
    @CurrentUser() user: JwtPayload,
    @Args('budgetId', ParseUUIDPipe) budgetId: string,
  ) {
    const id = user.userId;
    return this.budgetsService.getBudget(id, budgetId);
  }

  @UseGuards(JwtGuard)
  @Mutation('createBudget')
  createBudget(
    @CurrentUser() user: JwtPayload,
    @Args('newBudget') createBudgetDto: CreateBudgetDto,
  ) {
    const id = user.userId;
    return this.budgetsService.createBudget(id, createBudgetDto);
  }

  @UseGuards(JwtGuard)
  @UsePipes(budgetExistsPipe)
  @Mutation('editBudget')
  editBudget(
    @CurrentUser() user: JwtPayload,
    @Args('budgetId', ParseUUIDPipe) budgetId: string,
    @Args('budgetData') editBudgetDto: EditBudgetDto,
  ) {
    const id = user.userId;
    return this.budgetsService.editBudget(id, budgetId, editBudgetDto);
  }

  @UseGuards(JwtGuard)
  @UsePipes(budgetExistsPipe)
  @Mutation('deleteBudget')
  deleteBudget(
    @CurrentUser() user: JwtPayload,
    @Args('budgetId', ParseUUIDPipe) budgetId: string,
  ) {
    const id = user.userId;
    return this.budgetsService.deleteBudget(id, budgetId);
  }

  @UseGuards(JwtGuard)
  @UsePipes(budgetExistsPipe)
  @Mutation('archiveBudget')
  archiveBudget(
    @CurrentUser() user: JwtPayload,
    @Args('budgetId', ParseUUIDPipe) budgetId: string,
  ) {
    const id = user.userId;
    return this.budgetsService.archiveBudget(id, budgetId);
  }

  @ResolveField('expenses')
  getBudgetExpenses(@Parent() budget: Budget) {
    const { id } = budget;
    return this.budgetsService.getBudgetExpenses(id);
  }
}
