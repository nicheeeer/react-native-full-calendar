import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useState,
} from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { usePanGesture } from '../hooks/usePanGesture';
import { useSwiperController } from '../hooks/useSwiperController';
import { SwiperContext, WithWrappedProvider } from '../store';
import { SwiperController } from '../types';
import { Page } from './Page';

const Swiper = React.forwardRef<SwiperController>((_, ref) => {
  const { props } = useContext(SwiperContext);
  const {
    vertical,
    buffer,
    style,
    pageWrapperStyle,
    width,
    height,
    initialIndex,
  } = props;

  const pageWidth = useSharedValue(width || 0);
  const pageHeight = useSharedValue(height || 0);

  const viewSize = vertical ? pageHeight : pageWidth;

  const [pageLayout, setPageLayout] = useState<number>(0);

  const translate = useSharedValue(0);

  const pageAnim = useSharedValue(initialIndex);

  useDerivedValue(() => {
    if (viewSize.value) {
      pageAnim.value = initialIndex + (translate.value / viewSize.value) * -1;
    }
  }, [viewSize, pageAnim, translate, initialIndex]);

  const { setPage, prevPage, nextPage, getCurrIndex } = useSwiperController({
    layoutPage: pageLayout,
    viewSize,
    translate,
    pageAnim,
  });

  useImperativeHandle(ref, () => ({
    setPage,
    nextPage,
    prevPage,
    getCurrIndex,
  }));
  const curIndex = getCurrIndex();

  const pageIndices = [...Array(buffer * 2 + 1)].map((_, i) => {
    const bufferIndex = i - buffer;
    return curIndex - bufferIndex;
  });

  const panGesture = usePanGesture({ curIndex, translate, viewSize });

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { height: layoutHeight, width: layoutWidth } = e.nativeEvent.layout;

      pageWidth.value = layoutWidth;
      pageHeight.value = layoutHeight;
      setPageLayout(vertical ? layoutHeight : layoutWidth);
    },
    [vertical, pageWidth, pageHeight]
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[style]} onLayout={handleLayout}>
        {pageIndices.map((pageIndex) => {
          return (
            <Page
              key={pageIndex}
              pageAnim={pageAnim}
              index={pageIndex}
              pageWidth={pageWidth}
              pageHeight={pageHeight}
              viewSize={viewSize}
              isActive={pageIndex === curIndex}
              style={pageWrapperStyle}
            />
          );
        })}
      </View>
    </GestureDetector>
  );
});

export default WithWrappedProvider(Swiper);
