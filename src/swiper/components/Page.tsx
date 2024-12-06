import type { PropsWithChildren } from 'react';
import React, { useContext } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { DerivedValue, interpolate, makeMutable, SharedValue, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { SwiperContext } from '../store';

interface Props {
    pageAnim: SharedValue<number>;
    index: number;
    pageWidth: SharedValue<number>;
    pageHeight: SharedValue<number>;
    viewSize: SharedValue<number>;
    isActive: boolean;
    style?: StyleProp<ViewStyle>;
}
const preInitSize = makeMutable(99999);

export const Page = ({ index, pageAnim, pageWidth, pageHeight, isActive, style, viewSize }: PropsWithChildren<Props>) => {
    const { props } = useContext(SwiperContext);
    const { buffer, initialIndex, vertical, renderPage } = props;

    const translation = useDerivedValue(() => {
        const translate = (index - pageAnim.value) * viewSize.value;
        return translate;
    }, []);

    const focusAnim = useDerivedValue(() => {
        if (!viewSize.value) {
            return index - initialIndex;
        }

        return translation.value / viewSize.value;
    }, [initialIndex]);

    const animStyle = useAnimatedStyle(() => {
        const hasInitialized = !!viewSize.value;
        const isInactivePageBeforeInit = !(index === initialIndex) && !hasInitialized;
        const _pageWidth = isInactivePageBeforeInit ? preInitSize : pageWidth;
        const _pageHeight = isInactivePageBeforeInit ? preInitSize : pageHeight;

        return pageInterpolatorSlide({
            focusAnim,
            pageWidth: _pageWidth,
            pageHeight: _pageHeight,
            vertical,
        });
    }, [pageWidth, pageHeight, pageAnim, index, initialIndex, translation, vertical, buffer]);

    return (
        <Animated.View pointerEvents={isActive ? 'auto' : 'none'} style={[style, styles.pageWrapper, animStyle, isActive && styles.activePage]}>
            {renderPage({
                index,
                isActive,
                focusAnim,
                pageWidthAnim: pageWidth,
                pageHeightAnim: pageHeight,
                pageAnim,
            })}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    pageWrapper: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
    },
    activePage: {
        position: 'relative',
    },
});

interface PageInterpolatorParams {
    vertical: boolean;
    focusAnim: DerivedValue<number>;
    pageWidth: SharedValue<number>;
    pageHeight: SharedValue<number>;
}

export const pageInterpolatorSlide = ({ focusAnim, pageWidth, pageHeight, vertical }: PageInterpolatorParams): ReturnType<typeof useAnimatedStyle> => {
    'worklet';

    const translateX = vertical ? 0 : interpolate(focusAnim.value, [-1, 0, 1], [-pageWidth.value, 0, pageWidth.value]);
    const translateY = vertical ? interpolate(focusAnim.value, [-1, 0, 1], [-pageHeight.value, 0, pageHeight.value]) : 0;

    return {
        transform: [{ translateX }, { translateY }],
    };
};
