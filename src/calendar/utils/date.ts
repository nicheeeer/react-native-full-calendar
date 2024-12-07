import {
  addDays,
  differenceInCalendarDays,
  differenceInWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { DateString } from '../type';

export const getWeeksInMonth = (date: Date | string) => {
  const startWeek = startOfWeek(startOfMonth(date));
  const endWeek = endOfWeek(endOfMonth(date));
  const weeksInMonth = differenceInWeeks(endWeek, startWeek) + 1;

  return weeksInMonth;
};

export const isLastWeekOfMonth = (date: Date): boolean => {
  const lastDayOfMonth = endOfMonth(date);

  const startOfLastWeek = startOfWeek(lastDayOfMonth);

  return isSameDay(date, startOfLastWeek) || isAfter(date, startOfLastWeek);
};

export const isSameStartOfWeek = (date: Date, { weekStartDay }): boolean => {
  const startOfTheWeek = startOfWeek(date, { weekStartsOn: weekStartDay });
  return isSameDay(date, startOfTheWeek);
};

export const isSameStartOfMonth = (date: Date): boolean => {
  const startOfTheMonth = startOfMonth(date);
  return isSameDay(date, startOfTheMonth);
};

export const getIterableDateBetweenDates = (
  startDate: Date,
  endDate: Date
): DateString[] => {
  const dates = [];

  let currDate = startDate;

  while (isWithinInterval(currDate, { start: startDate, end: endDate })) {
    dates.push(format(currDate, 'yyyy-MM-dd'));
    currDate = addDays(currDate, 1);
  }

  return dates;
};

export const getDaysRemaining = (date: Date) => {
  if (isLastWeekOfMonth(date)) {
    return differenceInCalendarDays(endOfMonth(date), date) + 1;
  }
  return differenceInCalendarDays(endOfWeek(date), date) + 1;
};
