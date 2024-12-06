import React from 'react';
import { SwiperController, SwiperProps } from './types';
import { usePropsValidate } from './hooks/usePropsValidate';
import { useInitProps } from './hooks/useInitProps';

export interface ISwiperContext {
    props: SwiperProps;
}
export const SwiperContext = React.createContext<ISwiperContext>({
    props: null,
});

export const WithWrappedProvider = (WrappedComponent: React.ComponentType<any>) => {
    return React.forwardRef<SwiperController, SwiperProps>((_props, ref: React.ForwardedRef<SwiperController>) => {
        usePropsValidate(_props);
        const props = useInitProps(_props);
        return (
            <SwiperContext.Provider value={{ props }}>
                <WrappedComponent ref={ref} />
            </SwiperContext.Provider>
        );
    });
};
