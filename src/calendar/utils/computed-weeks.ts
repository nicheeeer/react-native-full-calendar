import { getWeeksInMonth } from './date';
import { addMonths, endOfMonth, format, isSameWeek, subMonths } from 'date-fns';

export const computedWeeksOfMonth = (date: Date, isDisabled: boolean) => {
  let weeks = getWeeksInMonth(date);

  const nextMonthFirstDay = format(addMonths(date, 1), 'yyyy-MM-01');

  const prevMonthLastDay = format(endOfMonth(subMonths(date, 1)), 'yyyy-MM-dd');

  if (isSameWeek(date, nextMonthFirstDay) && isDisabled) {
    weeks = getWeeksInMonth(nextMonthFirstDay);
  }

  if (isSameWeek(date, prevMonthLastDay) && isDisabled) {
    weeks = getWeeksInMonth(prevMonthLastDay);
  }
  return weeks;
};
