import React from 'react';
import { SwiperProps } from '../types';

export function usePropsValidate(props: SwiperProps) {
  React.useEffect(() => {
    const { renderPage } = props;
    if (!renderPage) {
      throw new Error('renderPage must be defined.');
    }
  }, [props]);
}
