import React from 'react';
import { useInitProps } from './hooks/useInitProps';
import { CalendarController, CalendarDataWithMetadata, CalendarProps, DateString } from './type';

export type DataMap = { [key: DateString]: CalendarDataWithMetadata[] };

export type CalendarContext = Omit<CalendarProps, 'data'> & {
    initialDateRef: React.MutableRefObject<Date>;
    dataMap: DataMap;
};

export const CalendarContext = React.createContext<CalendarContext>(null);

export const WithWrappedProvider = (WrappedComponent: React.FunctionComponent<any>) => {
    return React.forwardRef<CalendarController, CalendarProps>((_props, ref: React.ForwardedRef<CalendarController>) => {
        const props = useInitProps(_props);

        return (
            <CalendarContext.Provider value={{ ...props }}>
                <WrappedComponent ref={ref} />
            </CalendarContext.Provider>
        );
    });
};
