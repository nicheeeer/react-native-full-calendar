import { useCallback } from 'react';
import { CalendarController, ImperativeOptions } from '../type';
import { differenceInCalendarMonths } from 'date-fns';
import { SwiperController } from 'src/swiper/types';

interface IProps {
    swiperRef: React.MutableRefObject<SwiperController>;
    initialDateRef: React.MutableRefObject<Date>;
}

export function useCalendarController(options: IProps): CalendarController {
    const { swiperRef, initialDateRef } = options;

    const setPage = (date: Date, options?: ImperativeOptions) => {
        const animated = options?.animated ?? false;
        const page = differenceInCalendarMonths(date, initialDateRef.current);
        swiperRef.current?.setPage(page, { animated });
    };

    const nextPage = useCallback(async (options: ImperativeOptions = {}) => {
        const animated = options?.animated ?? true;
        swiperRef.current?.nextPage({ animated });
    }, []);

    const prevPage = useCallback(async (options: ImperativeOptions = {}) => {
        const animated = options?.animated ?? true;
        swiperRef.current?.prevPage({ animated });
    }, []);

    return {
        setPage,
        nextPage,
        prevPage,
    };
}
