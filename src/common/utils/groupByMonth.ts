/* eslint-disable prettier/prettier */
import * as moment from 'moment';
import { ExpensesPerMonth } from '../graphqlDefinitions';

type TExpensesPerMonth = {
  createdAt: string;
  amount: number;
}[];

export const groupByMonth = (
  expenses: TExpensesPerMonth,
): ExpensesPerMonth[] => {
  const RawExpenses = expenses.map((m) => {
    return {
      month: String(moment(m.createdAt).get('month') + 1),
      amount: m.amount,
    };
  });

  const expensesMap = new Map<string, number>();

  RawExpenses.forEach((e) => {
    if (!expensesMap.has(e.month)) {
      expensesMap.set(e.month, e.amount);
    } else {
      expensesMap.set(e.month, expensesMap.get(e.month) + e.amount);
    }
  });

  const expensesPerMonths = new Array<ExpensesPerMonth>();

  expensesMap.forEach((val, key) => {
    expensesPerMonths.push({
      month: key,
      amount: val,
    });
  });

  return expensesPerMonths;
};
