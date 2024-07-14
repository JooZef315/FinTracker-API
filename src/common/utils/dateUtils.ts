/* eslint-disable prettier/prettier */
export const getNextMonth = () => {
  const currentDate = new Date();
  const nextMonth = currentDate.setMonth(currentDate.getMonth() + 1);
  const nextMonthDate = new Date(nextMonth).toISOString().split('T')[0];

  return nextMonthDate;
};
