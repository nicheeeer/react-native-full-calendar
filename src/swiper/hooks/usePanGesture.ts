import { useContext } from 'react';
import {
  Gesture,
  GestureStateChangeEvent,
  GestureTouchEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { GestureStateManagerType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gestureStateManager';
import {
  Easing,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SwiperContext } from '../store';

interface Iprops {
  curIndex: number;
  translate: SharedValue<number>;
  viewSize: SharedValue<number>;
}

export const usePanGesture = ({ curIndex, translate, viewSize }: Iprops) => {
  const { props } = useContext(SwiperContext);

  const { minIndex, maxIndex, vertical, initialIndex } = props;
  // Derived values for animation boundaries
  const minIndexAnim = useDerivedValue(() => minIndex, [minIndex]);
  const maxIndexAnim = useDerivedValue(() => maxIndex, [maxIndex]);
  const isMinIndex = useDerivedValue(
    () => curIndex <= minIndex,
    [curIndex, minIndex]
  );
  const isMaxIndex = useDerivedValue(
    () => curIndex >= maxIndex,
    [curIndex, maxIndex]
  );

  const initTouchX = useSharedValue(0);
  const initTouchY = useSharedValue(0);
  const startTranslate = useSharedValue(0);

  const handleBegin = (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    'worklet';

    startTranslate.value = translate.value;
    initTouchX.value = e.x;
    initTouchY.value = e.y;
  };

  const handleTouchesMove = (
    { changedTouches }: GestureTouchEvent,
    mgr: GestureStateManagerType
  ) => {
    'worklet';

    const mainTouch = changedTouches[0];
    const initialTouch = vertical ? initTouchY.value : initTouchX.value;
    const currentTouch = vertical ? mainTouch.y : mainTouch.x;

    const translateDelta = currentTouch - initialTouch;
    if (
      (isMinIndex.value && translateDelta > 0) ||
      (isMaxIndex.value && translateDelta < 0)
    ) {
      mgr.fail();
    }
  };

  const handleUpdate = ({
    translationX,
    translationY,
  }: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    'worklet';

    const translation = vertical ? translationY : translationX;
    const crossAxisTranslation = vertical ? translationX : translationY;

    // Ignore gesture if swiping on the cross-axis
    if (
      Math.abs(crossAxisTranslation) > 10 &&
      Math.abs(crossAxisTranslation) > Math.abs(translation)
    ) {
      return;
    }

    const updatedTranslate = startTranslate.value + translation;

    const page = initialIndex + -updatedTranslate / viewSize.value;

    if (page >= minIndexAnim.value && page <= maxIndexAnim.value) {
      translate.value = updatedTranslate;
    } else {
      const boundary =
        page < minIndexAnim.value ? minIndexAnim.value : maxIndexAnim.value;
      const overflowPercentage = boundary - page;
      const clampedTranslation =
        updatedTranslate - overflowPercentage * viewSize.value;
      const bounceTranslation = overflowPercentage * viewSize.value;
      translate.value = clampedTranslation + bounceTranslation;
    }
  };

  const handleEnd = ({
    velocityX,
    velocityY,
    translationX,
    translationY,
  }: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    'worklet';

    const velocity = vertical ? velocityY : velocityX;
    const translation = vertical ? translationY : translationX;
    const crossAxisTranslation = vertical ? translationX : translationY;

    // Ignore if swiping on the cross-axis
    if (Math.abs(crossAxisTranslation) > Math.abs(translation)) {
      return;
    }

    // Determine if it's a fling gesture
    const isFling = Math.abs(velocity) > 500;
    let velocityOffset = isFling ? viewSize.value / 2 : 0;
    if (velocity < 0) {
      velocityOffset *= -1;
    }

    let targetPage =
      initialIndex -
      Math.round((translate.value + velocityOffset) / viewSize.value);
    targetPage = Math.max(
      minIndexAnim.value,
      Math.min(maxIndexAnim.value, targetPage)
    );

    translate.value = withTiming(
      -(targetPage - initialIndex) * viewSize.value,
      {
        duration: 500,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      }
    );
  };

  const panGesture = Gesture.Pan()
    .onBegin(handleBegin)
    .onTouchesMove(handleTouchesMove)
    .onUpdate(handleUpdate)
    .onEnd(handleEnd);

  return panGesture;
};
