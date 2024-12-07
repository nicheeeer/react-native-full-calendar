import { format, getDate, isSameDay } from 'date-fns';
import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CalendarContext } from '../../store';
import {
  CalendarData,
  CalendarDataWithMetadata,
  OnDatePress,
} from '../../type';
import { Day } from './Day';

const handleItems = (items: CalendarDataWithMetadata[]): CalendarData[] => {
  return items.map((v) => {
    if (!v) {
      return null;
    }
    const { metadata: _metadata, ...data } = v;
    return data;
  });
};

interface IProps {
  isDisabled: boolean;
  date: Date;
}

export const DayWrapper = React.memo(({ date, isDisabled }: IProps) => {
  const dateRef = useRef(date);
  const memoDate = useMemo(() => {
    if (isSameDay(dateRef.current, date)) {
      return dateRef.current;
    } else {
      dateRef.current = date;
      return date;
    }
  }, [date]);

  const {
    selectedDate,
    onDatePress,
    renderDate,
    weekStartDay,
    dataMap,
    theme,
    renderMoreItemText,
    maxVisibleCount,
  } = useContext(CalendarContext);

  const isSelected = useMemo(() => {
    return !!selectedDate && isSameDay(memoDate, selectedDate);
  }, [memoDate, selectedDate]);

  const isToday = useMemo(() => isSameDay(memoDate, new Date()), [memoDate]);

  const onDateSelectRef = useRef(onDatePress);
  onDateSelectRef.current = onDatePress;

  const onDateSelectCb: OnDatePress = useCallback((_date, options) => {
    return onDateSelectRef.current?.(_date, options);
  }, []);

  const items: CalendarDataWithMetadata[] =
    dataMap[format(date, 'yyyy-MM-dd')] || [];

  if (renderDate) {
    return renderDate({
      date,
      isDisabled,
      isSelected,
      isToday,
      itemsWithMetadata: items,
      items: handleItems(items),
    });
  }
  const onPress = () => {
    onDateSelectCb(date, {
      isSelected,
      isToday,
      isDisabled,
      items: handleItems(items),
      itemsWithMetadata: items,
    });
  };
  const zIndex = 100 - getDate(date);

  return (
    <View style={[styleSheet.flex, { zIndex }]}>
      <TouchableOpacity onPress={onPress} style={styleSheet.coverContainer} />
      <Day
        date={memoDate}
        isToday={isToday}
        isDisabled={isDisabled}
        theme={theme}
        items={items}
        weekStartDay={weekStartDay}
        renderMoreItemText={renderMoreItemText}
        maxVisibleCount={maxVisibleCount}
        isSelected={isSelected}
      />
    </View>
  );
});

const styleSheet = StyleSheet.create({
  flex: { flex: 1 },
  coverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 101,
  },
});
