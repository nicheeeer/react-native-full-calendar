import { SwiperProps } from '../types';

export function useInitProps(props: SwiperProps): SwiperProps {
  const {
    vertical = false,
    onPageChange,
    buffer = 1,
    style,
    pageWrapperStyle,
    minIndex = -Infinity,
    maxIndex = Infinity,
    renderPage,
    width,
    height,
    initialIndex = 0,
  } = props;

  return {
    ...props,
    vertical,
    onPageChange,
    buffer,
    style,
    pageWrapperStyle,
    minIndex,
    maxIndex,
    renderPage,
    width,
    height,
    initialIndex,
  };
}
