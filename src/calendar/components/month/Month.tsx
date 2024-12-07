import {
  addDays,
  addMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  lastDayOfMonth,
} from 'date-fns';
import React, { useContext, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { CalendarContext } from '../../store';
import { DayLabels } from '../day/DayLabel';
import { Header } from '../header/Header';
import Week from '../week/Week';

export const Month = React.memo(({ index }: { index: number }) => {
  const { initialDate, weekStartDay, height, width } =
    useContext(CalendarContext);
  const firstDayOfMonth = useMemo(
    () => addMonths(initialDate, index),
    [initialDate, index]
  );
  firstDayOfMonth.setDate(1);
  const lastDayOfMo = useMemo(
    () => lastDayOfMonth(firstDayOfMonth),
    [firstDayOfMonth]
  );

  const weekStarts = useMemo(
    () =>
      eachWeekOfInterval(
        {
          start: firstDayOfMonth,
          end: lastDayOfMo,
        },
        {
          weekStartsOn: weekStartDay,
        }
      ),
    [firstDayOfMonth, lastDayOfMo, weekStartDay]
  );

  const weeks = useMemo(
    () =>
      weekStarts.map((week) => {
        return eachDayOfInterval({ start: week, end: addDays(week, 6) });
      }),
    [weekStarts]
  );
  const monthStyle: ViewStyle[] = [styleSheet.flex];
  if (height) {
    monthStyle.push({ height });
  }
  if (width) {
    monthStyle.push({ width });
  }

  return (
    <View style={monthStyle}>
      <Header index={index} />
      <DayLabels datesOfWeek={weeks[0]} />
      {weeks.map((week) => {
        return (
          <Week
            key={week[0]?.toISOString()}
            days={week}
            firstDayOfMonth={firstDayOfMonth}
          />
        );
      })}
    </View>
  );
});

const styleSheet = StyleSheet.create({
  flex: { flex: 1 },
});
