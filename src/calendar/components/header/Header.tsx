import { addMonths, format, lastDayOfMonth } from 'date-fns';
import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarContext } from '../../store';

export const Header = React.memo(({ index }: { index: number }) => {
    const { initialDateRef, renderHeader, theme } = useContext(CalendarContext);

    const firstDayOfMonth = useMemo(() => addMonths(initialDateRef.current, index), [initialDateRef.current, index]);
    firstDayOfMonth.setDate(1);
    const lastDayOfMo = useMemo(() => lastDayOfMonth(firstDayOfMonth), [firstDayOfMonth]);

    const headerText = format(firstDayOfMonth, theme.headerDateFormat);

    return (
        <View>
            {renderHeader ? (
                renderHeader({ startDate: firstDayOfMonth, endDate: lastDayOfMo })
            ) : (
                <View style={[styleSheet.headerStyle, theme.headerStyle]}>
                    <Text style={[theme.headerTextStyle]}>{headerText}</Text>
                </View>
            )}
        </View>
    );
});

const styleSheet = StyleSheet.create({
    headerStyle: {
        alignItems: 'center',
    },
});
