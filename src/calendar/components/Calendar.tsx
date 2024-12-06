import { addMonths, differenceInCalendarMonths, startOfMonth } from 'date-fns';
import React, { useCallback, useContext, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SwiperController } from 'src/swiper/types';
import Swiper from '../../swiper/components/Swiper';
import { useCalendarController } from '../hooks/useCalendarController';
import { CalendarContext, WithWrappedProvider } from '../store';
import { CalendarController, CalendarProps } from '../type';
import { Month } from './month/Month';

const Calendar = React.forwardRef<CalendarController>((_, ref) => {
    const { onPageChange, buffer, minDate, maxDate, theme, initialDateRef } = useContext(CalendarContext);

    const swiperRef = useRef<SwiperController>(null);

    const minSwiperIndex = useMemo(() => {
        if (!minDate) return -Infinity;
        return differenceInCalendarMonths(initialDateRef.current, minDate) * -1;
    }, [minDate]);

    const maxSwiperIndex = useMemo(() => {
        if (!maxDate) return Infinity;
        return differenceInCalendarMonths(initialDateRef.current, maxDate) * -1;
    }, [maxDate]);

    const onPageChangeRef = useRef(onPageChange);
    onPageChangeRef.current = onPageChange;

    const { nextPage, prevPage, setPage } = useCalendarController({ swiperRef, initialDateRef });

    useImperativeHandle(
        ref,
        () => ({
            nextPage,
            prevPage,
            setPage,
        }),
        [],
    );

    const onMonthChange = useCallback((pg: number) => {
        const offsetDate = addMonths(initialDateRef.current, pg);
        const startDateOfMonth = startOfMonth(offsetDate);

        onPageChangeRef.current?.(startDateOfMonth);
    }, []);

    return (
        <View style={[styleSheet.flex, theme.style]}>
            <Swiper
                ref={swiperRef}
                renderPage={({ index }) => <Month index={index} />}
                buffer={buffer}
                onPageChange={onMonthChange}
                minIndex={minSwiperIndex}
                maxIndex={maxSwiperIndex}
                pageWrapperStyle={[styleSheet.flex, theme.containerStyle]}
                style={{ flex: 1 }}
            />
        </View>
    );
});

export default WithWrappedProvider(Calendar) as React.FunctionComponent<CalendarProps>;

const styleSheet = StyleSheet.create({
    flex: { flex: 1 },
});
