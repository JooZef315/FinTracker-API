import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import {
  DefaultValuePipe,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  UsePipes,
} from '@nestjs/common';
import { userExistsPipe } from 'src/common/pipes/userExists.pipe';
import { AddIncomeDto } from './dto/addIncomeDto';
import { AddExpenseDto } from './dto/AddExpenseDto';
import { ExpenseCategory, IncomeCategory } from 'src/common/enums';

@Resolver()
export class TransactionsResolver {
  private ITEMS_PER_PAGE: number;
  constructor(private readonly transactionsService: TransactionsService) {
    this.ITEMS_PER_PAGE = 4;
  }

  @Query('income')
  @UsePipes(userExistsPipe)
  getIncome(
    @Args('id', ParseUUIDPipe) id: string,
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
    return this.transactionsService.getIncome(
      id,
      this.ITEMS_PER_PAGE,
      page,
      source,
      before,
      after,
    );
  }

  @Query('expense')
  @UsePipes(userExistsPipe)
  getExpense(
    @Args('id', ParseUUIDPipe) id: string,
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
    return this.transactionsService.getExpense(
      id,
      this.ITEMS_PER_PAGE,
      page,
      category,
      before,
      after,
    );
  }

  @Mutation('addIncome')
  @UsePipes(userExistsPipe)
  addIncome(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('newIncome') addIncomeDto: AddIncomeDto,
  ) {
    return this.transactionsService.addIncome(id, addIncomeDto);
  }

  @Mutation('addExpense')
  @UsePipes(userExistsPipe)
  addExpense(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('newExpense') addExpenseDto: AddExpenseDto,
  ) {
    return this.transactionsService.addExpense(id, addExpenseDto);
  }
}
