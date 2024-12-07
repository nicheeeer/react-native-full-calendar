import { differenceInDays } from 'date-fns';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { CalendarDataWithMetadata, Theme, WeekDayIndex } from '../../type';
import { computedWeeksOfMonth } from '../../utils/computed-weeks';
import {
  getDaysRemaining,
  isSameStartOfMonth,
  isSameStartOfWeek,
} from '../../utils/date';

interface IProps {
  date: Date;
  isDisabled: boolean;
  item: CalendarDataWithMetadata;
  weekStartDay: WeekDayIndex;
  theme: Theme;
  index: number;
  maxVisibleCount: number;
}

export const Item = ({
  date,
  isDisabled,
  item,
  weekStartDay,
  theme,
  index,
  maxVisibleCount,
}: IProps) => {
  const weeks = computedWeeksOfMonth(date, isDisabled);
  const daysRemaining = getDaysRemaining(date);
  const isFirstWeekDay = isSameStartOfWeek(date, { weekStartDay });
  const isFirstMonthDay = isSameStartOfMonth(date);

  const dayItemStyle: StyleProp<ViewStyle>[] = [
    styleSheet.dayItem,
    { height: `${Math.floor(100 / (maxVisibleCount + 2))}%` },
  ];

  if (item === null) {
    if (theme.dayItemStyle) {
      dayItemStyle.push(theme.dayItemStyle);
    }
    return <View style={dayItemStyle} key={index} />;
  }
  const datesInRange = item.metadata.datesInRange;
  let scheduleDaysRemaining = daysRemaining;

  if (datesInRange.length) {
    const endDate = datesInRange[datesInRange.length - 1];
    const startDate = date;
    const daysDifference = differenceInDays(endDate, startDate);

    if (daysDifference < daysRemaining) {
      scheduleDaysRemaining = daysDifference + 1;
    }
  }
  const isShowContents =
    item.metadata.isStart || isFirstWeekDay || isFirstMonthDay;

  let width = isShowContents
    ? (datesInRange.length > scheduleDaysRemaining
        ? scheduleDaysRemaining
        : datesInRange.length) * 100
    : 0;

  dayItemStyle.push({
    backgroundColor: item.color,
  });

  if (item.metadata.isStart) {
    dayItemStyle.push({
      marginStart: theme.itemStartMargin,
      borderTopLeftRadius: theme.itemStartBorderRadius,
      borderBottomLeftRadius: theme.itemStartBorderRadius,
    });
  }

  if (item.metadata.isEnd) {
    dayItemStyle.push({
      marginEnd: theme.itemEndMargin,
      borderTopRightRadius: theme.itemEndBorderRadius,
      borderBottomRightRadius: theme.itemEndBorderRadius,
    });
  }

  if (theme.dayItemStyle) {
    dayItemStyle.push(theme.dayItemStyle);
  }

  const textStyle: StyleProp<TextStyle> = {
    fontSize: 48 / weeks,
    color: 'white',
    left: isShowContents ? 2 : 0,
    width: `${width}%`,
  };

  return (
    <View style={dayItemStyle}>
      <Text style={[textStyle, theme.dayItemTextStyle]} numberOfLines={1}>
        {isShowContents ? item.content : ''}
      </Text>
    </View>
  );
};
const styleSheet = StyleSheet.create({
  dayItem: {
    alignItems: 'flex-start',
    marginVertical: '2%',
    justifyContent: 'center',
  },
});
