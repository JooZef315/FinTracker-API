import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import {
  DefaultValuePipe,
  ParseEnumPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AddIncomeDto } from './dto/addIncomeDto';
import { AddExpenseDto } from './dto/AddExpenseDto';
import { ExpenseCategory, IncomeCategory } from 'src/common/enums';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/role.decorator';

@Resolver()
export class TransactionsResolver {
  private ITEMS_PER_PAGE: number;
  constructor(private readonly transactionsService: TransactionsService) {
    this.ITEMS_PER_PAGE = 4;
  }

  @UseGuards(JwtGuard)
  @Query('income')
  getIncome(
    @CurrentUser() user: JwtPayload,
    @Args('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Args(
      'source',
      new ParseEnumPipe(IncomeCategory, {
        optional: true,
      }),
    )
    source: IncomeCategory,
    @Args('before') before: string,
    @Args('after') after: string,
  ) {
    const id = user.userId;
    return this.transactionsService.getIncome(
      id,
      this.ITEMS_PER_PAGE,
      page,
      source,
      before,
      after,
    );
  }

  @UseGuards(JwtGuard)
  @Query('expense')
  getExpense(
    @CurrentUser() user: JwtPayload,
    @Args('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Args(
      'category',
      new ParseEnumPipe(ExpenseCategory, {
        optional: true,
      }),
    )
    category: ExpenseCategory,
    @Args('before') before: string,
    @Args('after') after: string,
  ) {
    const id = user.userId;
    return this.transactionsService.getExpense(
      id,
      this.ITEMS_PER_PAGE,
      page,
      category,
      before,
      after,
    );
  }

  @UseGuards(JwtGuard)
  @Mutation('addIncome')
  addIncome(
    @CurrentUser() user: JwtPayload,
    @Args('newIncome') addIncomeDto: AddIncomeDto,
  ) {
    const id = user.userId;
    return this.transactionsService.addIncome(id, addIncomeDto);
  }

  @UseGuards(JwtGuard)
  @Mutation('addExpense')
  addExpense(
    @CurrentUser() user: JwtPayload,
    @Args('newExpense') addExpenseDto: AddExpenseDto,
  ) {
    const id = user.userId;
    return this.transactionsService.addExpense(id, addExpenseDto);
  }
}
