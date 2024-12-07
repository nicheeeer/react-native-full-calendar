import { differenceInDays, format, subDays } from 'date-fns';
import { DataMap } from '../store';
import { alignDataList } from './computed-array-merge';
import { getIterableDateBetweenDates } from './date';
import { CalendarData, CalendarDataWithMetadata } from '../type';

export const computedCalendarData = (dataList: CalendarData[]): DataMap => {
  const dataListWithMetadata = dataList.map((data) => {
    return computedRangeDates(data);
  });

  const dataMap: DataMap = {};

  for (const event of dataListWithMetadata) {
    for (const date of event.metadata.datesInRange) {
      const eventCopy = {
        ...event,
        isStart: false,
        isEnd: false,
      };
      dataMap[date] = dataMap[date]
        ? [...dataMap[date], eventCopy]
        : [eventCopy];
    }
  }

  Object.keys(dataMap)
    .sort((a, b) => differenceInDays(a, b))
    .forEach((eventDate) => {
      const prevDate = format(subDays(eventDate, 1), 'yyyy-MM-dd');
      const prevEventList = updateStartEndFlags(
        dataMap[prevDate] || [],
        prevDate
      );
      const currentEventList = updateStartEndFlags(
        dataMap[eventDate] || [],
        eventDate
      );

      // data merge
      dataMap[eventDate] = alignDataList(prevEventList, currentEventList);
    });

  return dataMap;
};

const updateStartEndFlags = (
  dataListWithMetadata: CalendarDataWithMetadata[],
  referenceDate: string
): CalendarDataWithMetadata[] => {
  return dataListWithMetadata.map((dataWithMetadata) => {
    if (!dataWithMetadata) {
      return null;
    }
    const dateIndex = dataWithMetadata.metadata.datesInRange?.findIndex(
      (date) => date === referenceDate
    );

    return {
      ...dataWithMetadata,
      metadata: {
        ...dataWithMetadata.metadata,
        isStart: dateIndex === 0,
        isEnd: dateIndex + 1 === dataWithMetadata.metadata.datesInRange?.length,
      },
    };
  });
};

const computedRangeDates = (data: CalendarData): CalendarDataWithMetadata => {
  const startDate = data.startAt;
  const endDate = data.endAt;

  const datesInRange = getIterableDateBetweenDates(startDate, endDate);

  return {
    ...data,
    metadata: {
      datesInRange,
      isEnd: false,
      isStart: false,
    },
  };
};
