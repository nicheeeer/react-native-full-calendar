import { format } from 'date-fns';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarContext } from '../../store';

export function DayLabels({ datesOfWeek }: { datesOfWeek: Date[] }) {
  return (
    <View style={styleSheet.row}>
      <View style={styleSheet.dayLabelRow}>
        {datesOfWeek.map((date) => (
          <DayLabel key={date.toISOString()} date={date} />
        ))}
      </View>
    </View>
  );
}

export function DayLabel({ date }: { date: Date }) {
  const { renderDayLabel, theme } = useContext(CalendarContext);

  return renderDayLabel ? (
    renderDayLabel({ date })
  ) : (
    <View style={styleSheet.dayLabelContainer}>
      <Text>{format(date, theme.dayLabelDateFormat)}</Text>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  dayLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLabelRow: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
  },
});
