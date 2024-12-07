import type { StyleProp, ViewStyle } from 'react-native';
import type { DerivedValue, SharedValue } from 'react-native-reanimated';

export type ImperativeOptions = {
  animated?: boolean;
};
export interface SwiperController {
  getCurrIndex: () => number;
  setPage: (index: number, options?: ImperativeOptions) => void;
  prevPage: (options?: ImperativeOptions) => void;
  nextPage: (options?: ImperativeOptions) => void;
}

export type SwiperRenderPageProps = {
  index: number;
  focusAnim: DerivedValue<number>;
  isActive: boolean;
  pageWidthAnim: SharedValue<number>;
  pageHeightAnim: SharedValue<number>;
  pageAnim: SharedValue<number>;
};

export type SwiperRenderPage = (
  props: SwiperRenderPageProps
) => JSX.Element | null;

export interface SwiperProps {
  vertical?: boolean;
  renderPage: SwiperRenderPage;
  onPageChange?: (page: number) => void;
  buffer?: number;
  style?: StyleProp<ViewStyle>;
  pageWrapperStyle?: StyleProp<ViewStyle>;
  minIndex?: number;
  maxIndex?: number;
  width?: number;
  height?: number;
  initialIndex?: number;
}
