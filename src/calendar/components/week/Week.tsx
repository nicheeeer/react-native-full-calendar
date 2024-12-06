import { isSameMonth } from 'date-fns';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { computedWeeksOfMonth } from '../../../../src/calendar/utils/computed-weeks';
import { DayWrapper } from '../day/DayWrapper';

function Week({ days, firstDayOfMonth }: { days: Date[]; firstDayOfMonth: Date }) {
    const sameMonth = isSameMonth(days[0], firstDayOfMonth);
    const weeks = computedWeeksOfMonth(days[0], sameMonth ? false : true);

    const weekStyle: ViewStyle[] = [styles.weekContainer, { height: `${Math.floor(100 / weeks)}%` }];
    return (
        <View style={weekStyle}>
            {days.map((day) => {
                const sameMonth = isSameMonth(day, firstDayOfMonth);
                return <DayWrapper key={day?.toISOString()} isDisabled={sameMonth ? false : true} date={day} />;
            })}
        </View>
    );
}

export default Week;

const styles = StyleSheet.create({
    weekContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
