import { useRef } from 'react';
import { DEFAULT_THEME } from '../default';
import { CalendarContext } from '../store';
import { CalendarProps, Theme } from '../type';
import { computedCalendarData } from '../utils/computed-calendar-data';
import { useIsEqual } from './useIsEqual';

export function useInitProps(props: CalendarProps): CalendarContext {
  const {
    selectedDate,
    onDatePress,
    onPageChange,
    currentDate = new Date(),
    renderHeader,
    renderDate,
    renderDayLabel,
    renderMoreItemText,
    theme = {},
    buffer = 1,
    minDate,
    maxDate,
    weekStartDay = 0, // Sunday
    height,
    width,
    data,
    maxVisibleCount = 4,
  } = props;
  const initialDateRef = useRef(currentDate);
  const memoizationTheme = useIsEqual<Theme>({
    data: {
      ...DEFAULT_THEME,
      ...theme,
    },
  });

  return {
    ...props,
    selectedDate,
    onDatePress,
    onPageChange,
    currentDate,
    renderHeader,
    renderDate,
    renderDayLabel,
    renderMoreItemText,
    theme: memoizationTheme,
    buffer,
    minDate,
    maxDate,
    weekStartDay,
    initialDate: initialDateRef.current,
    height,
    width,
    maxVisibleCount,
    dataMap: computedCalendarData(data),
  };
}
