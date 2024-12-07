import { format } from 'date-fns';
import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {
  CalendarDataWithMetadata,
  RenderMoreItemText,
  Theme,
  WeekDayIndex,
} from '../../type';
import { computedWeeksOfMonth } from '../../utils/computed-weeks';
import { Item } from './Item';

interface IProps {
  date: Date;
  isDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  items: CalendarDataWithMetadata[];
  weekStartDay: WeekDayIndex;
  theme: Theme;
  renderMoreItemText: RenderMoreItemText;
  maxVisibleCount: number;
}

export const Day = React.memo(
  ({
    date,
    isDisabled,
    isToday,
    items,
    weekStartDay,
    theme,
    renderMoreItemText,
    maxVisibleCount,
    isSelected,
  }: IProps) => {
    const weeks = computedWeeksOfMonth(date, isDisabled);

    const renderDayText = () => {
      const dayNumberTextStyle: StyleProp<TextStyle>[] = [
        { fontSize: 48 / weeks },
        theme.dayNumberTextStyle,
      ];
      const dayNumberStyle: StyleProp<ViewStyle>[] = [
        styleSheet.dayNumberStyle,
        theme.dayNumberStyle,
      ];
      if (isToday) {
        dayNumberTextStyle.push(theme.dayTodayTextStyle);
        dayNumberStyle.push(theme.dayTodayStyle);
      }

      return (
        <View style={dayNumberStyle}>
          <Text style={dayNumberTextStyle}>
            {format(date, theme.dayTextForamt)}
          </Text>
        </View>
      );
    };

    const dayContainerStyle: StyleProp<ViewStyle>[] = [
      styleSheet.dayContainerStyle,
      theme.dayContainerStyle,
    ];
    const isOverFlow = useMemo(
      () => items.length >= maxVisibleCount + 1,
      [maxVisibleCount, items.length]
    );
    if (isDisabled) {
      dayContainerStyle.push({ opacity: theme.disableOpacity });
    }
    if (isSelected) {
      dayContainerStyle.push(theme.daySelectedStyle);
    }

    return (
      <View style={dayContainerStyle}>
        {renderDayText()}
        {items.map((item, index) => {
          if (index >= maxVisibleCount) {
            return null;
          }
          return (
            <Item
              key={item?.id ? item?.id : index}
              date={date}
              isDisabled={isDisabled}
              theme={theme}
              item={item}
              index={index}
              weekStartDay={weekStartDay}
              maxVisibleCount={maxVisibleCount}
            />
          );
        })}
        {isOverFlow ? (
          renderMoreItemText ? (
            renderMoreItemText({
              count: items.slice(maxVisibleCount).filter((v) => v).length,
            })
          ) : (
            <Text style={[styleSheet.moreItemText, { fontSize: 48 / weeks }]}>
              +{items.slice(maxVisibleCount).filter((v) => v).length || '0'}
            </Text>
          )
        ) : null}
      </View>
    );
  },
  (prev, next) => {
    return isEqual(prev, next);
  }
);
const styleSheet = StyleSheet.create({
  dayContainerStyle: {
    flex: 1,
    borderColor: '#F5F5F5',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  dayNumberStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: '16%',
    width: '40%',
    marginVertical: '1%',
  },
  moreItemText: {
    paddingStart: 4,
    textAlign: 'center',
  },
});
