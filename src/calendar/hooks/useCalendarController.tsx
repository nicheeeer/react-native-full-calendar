import { useCallback } from 'react';
import { CalendarController, ImperativeOptions } from '../type';
import { differenceInCalendarMonths } from 'date-fns';
import { SwiperController } from 'src/swiper/types';

interface IProps {
  swiperRef: React.MutableRefObject<SwiperController>;
  initialDate: Date;
}

export function useCalendarController(props: IProps): CalendarController {
  const { swiperRef, initialDate } = props;

  const goToDatePage = (date: Date, options?: ImperativeOptions) => {
    const animated = options?.animated ?? false;
    const page = differenceInCalendarMonths(date, initialDate);
    swiperRef.current?.setPage(page, { animated });
  };

  const goToNextPage = useCallback(
    async (options: ImperativeOptions = {}) => {
      const animated = options?.animated ?? true;
      swiperRef.current?.nextPage({ animated });
    },
    [swiperRef]
  );

  const goToPrevPage = useCallback(
    async (options: ImperativeOptions = {}) => {
      const animated = options?.animated ?? true;
      swiperRef.current?.prevPage({ animated });
    },
    [swiperRef]
  );

  return {
    goToDatePage,
    goToNextPage,
    goToPrevPage,
  };
}
