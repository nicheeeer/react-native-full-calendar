import { useCallback, useContext, useState } from 'react';
import { Easing, runOnJS, SharedValue, useAnimatedReaction, withTiming } from 'react-native-reanimated';
import { SwiperContext } from '../store';
import { SwiperController } from '../types';

interface ICtrOptions {
    layoutPage: number;
    viewSize: SharedValue<number>;
    translate: SharedValue<number>;
    pageAnim: SharedValue<number>;
}

type ImperativeApiOptions = {
    animated?: boolean;
};

export function useSwiperController(ctrOptions: ICtrOptions): SwiperController {
    const { props } = useContext(SwiperContext);
    const { minIndex, maxIndex, initialIndex = 0, onPageChange } = props;
    const { layoutPage, viewSize, translate, pageAnim } = ctrOptions;
    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

    const onPageChangeInternal = (pg: number) => {
        onPageChange?.(pg);
        setCurrentIndex(pg);
    };

    useAnimatedReaction(
        () => {
            return Math.round(pageAnim.value);
        },
        (cur, prev) => {
            if (cur !== prev) {
                runOnJS(onPageChangeInternal)(cur);
            }
        },
        [],
    );

    const setPage = (index: number, options: ImperativeApiOptions = {}) => {
        const pSize = viewSize.value || layoutPage;
        const updatedTranslate = index * pSize * -1 + initialIndex * pSize;

        if (index < minIndex || index > maxIndex) return;

        if (options.animated) {
            translate.value = withTiming(updatedTranslate, { duration: 500, easing: Easing.bezier(0.25, 1, 0.5, 1) });
        } else {
            translate.value = updatedTranslate;
        }
    };

    const nextPage = useCallback(
        async (options: ImperativeApiOptions = {}) => {
            setPage(getCurrIndex() + 1, options);
        },
        [currentIndex],
    );

    const prevPage = useCallback(
        async (options: ImperativeApiOptions = {}) => {
            setPage(getCurrIndex() - 1, options);
        },
        [currentIndex],
    );

    const getCurrIndex = () => {
        return currentIndex;
    };

    return {
        setPage,
        getCurrIndex,
        nextPage,
        prevPage,
    };
}
