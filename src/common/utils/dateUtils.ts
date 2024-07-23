/* eslint-disable prettier/prettier */
import * as moment from 'moment';

export const getDate = () => {
  const currentDate = moment().format('YYYY-MM-DD');
  return currentDate;
};

export const getNextMonth = () => {
  const currentDate = new Date();
  const nextMonth = currentDate.setMonth(currentDate.getMonth() + 1);
  const nextMonthDate = new Date(nextMonth).toISOString().split('T')[0];

  return nextMonthDate;
};

export const comapreDates = (
  start: Date,
  end: Date,
  defaultStart?: string,
  defaultEnd?: string,
) => {
  const startDate: string = start
    ? String(start)
    : defaultStart
      ? defaultStart
      : new Date().toISOString().split('T')[0];
  const endDate: string = end
    ? String(end)
    : defaultEnd
      ? defaultEnd
      : getNextMonth();

  if (moment(startDate).isSameOrAfter(endDate)) {
    console.log(endDate);
    console.log(startDate);
    return false;
  }

  return true;
};
