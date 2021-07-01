/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useRef, useCallback } from 'react';
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  LayoutChangeEvent,
} from 'react-native';

import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import useSwipeableContext from './useSwipeableContext';
import { rubberClamp, springConfig } from './utils';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  children: ReactElement;
  renderRightActions?: () => ReactElement;
  renderLeftActions?: () => ReactElement;
  onOpened?: () => void;
  onClosed?: () => void;
  onItemPress?: () => void;
  onStartDrag?: () => void;
};

export default function SwipableItem({
  containerStyle,
  children,
  renderRightActions,
  renderLeftActions,
  onStartDrag = () => null,
  onOpened = () => null,
  onClosed = () => null,
  onItemPress = () => null,
}: Props) {
  const rightActionsWidth = useSharedValue(0);
  const leftActionsWidth = useSharedValue(0);
  const panRef = useRef(null);

  const { translateX, swipeableState, close } = useSwipeableContext();

  const findSnapPoint = useCallback((x: number, direction: string) => {
    'worklet';

    const snapPoints: number[] = [];
    if (rightActionsWidth.value > 0) {
      snapPoints.push(-rightActionsWidth.value);
    }
    snapPoints.push(0);
    if (leftActionsWidth.value > 0) {
      snapPoints.push(leftActionsWidth.value);
    }
    if (direction === 'right') {
      for (let i = snapPoints.length - 1; i >= 0; i -= 1) {
        if (x > snapPoints[i]) {
          const toIndex = Math.min(snapPoints.length - 1, i + 1);
          return snapPoints[toIndex];
        }
      }
    } else if (direction === 'left') {
      for (let i = 0; i < snapPoints.length; i += 1) {
        if (x < snapPoints[i]) {
          const toIndex = Math.max(0, i - 1);
          return snapPoints[toIndex];
        }
      }
    }
    return 0;
  }, []);

  const gestureHandler = useAnimatedGestureHandler(
    {
      onStart: (_, ctx: any) => {
        ctx.startX = translateX.value;
        runOnJS(onStartDrag)();
      },
      onActive: (event, ctx) => {
        const diff = (ctx.prevTranslationX || 0) - event.translationX;
        if (diff > 0) {
          ctx.gestureDirection = 'left';
        } else if (diff < 0) {
          ctx.gestureDirection = 'right';
        } else {
          ctx.gestureDirection = 'unknown';
        }
        ctx.prevTranslationX = event.translationX;
        const toValue = ctx.startX + event.translationX;
        const leftBound = -rightActionsWidth.value;
        const rightBound = leftActionsWidth.value;
        const value = rubberClamp(toValue, leftBound, rightBound);
        translateX.value = value;
      },
      onEnd: (event, ctx) => {
        const finalX = ctx.startX + event.translationX;
        const snapPoint = findSnapPoint(finalX, ctx.gestureDirection);
        const newState = snapPoint === 0 ? 'closed' : 'opened';
        if (newState !== swipeableState.value) {
          swipeableState.value = newState;
          if (newState === 'opened') {
            runOnJS(onOpened)();
          } else {
            runOnJS(onClosed)();
          }
        }
        translateX.value = withSpring(
          snapPoint || 0,
          springConfig(event.velocityX)
        );
      },
    },
    [findSnapPoint]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const handleRightActionsLayout = useCallback((layout: LayoutChangeEvent) => {
    rightActionsWidth.value = layout.nativeEvent.layout.width;
  }, []);

  const handleLeftActionsLayout = useCallback((layout: LayoutChangeEvent) => {
    leftActionsWidth.value = layout.nativeEvent.layout.width;
  }, []);

  const handleItemTap = useCallback(() => {
    if (swipeableState.value === 'opened') {
      close();
      return;
    }
    onItemPress();
  }, [close, onItemPress]);

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={gestureHandler}
      activeOffsetX={[-10, 10]}
    >
      <Animated.View style={[styles.container, containerStyle]}>
        {renderRightActions && (
          <View onLayout={handleRightActionsLayout} style={styles.rightActions}>
            {renderRightActions()}
          </View>
        )}
        {renderLeftActions && (
          <View onLayout={handleLeftActionsLayout} style={styles.leftActions}>
            {renderLeftActions()}
          </View>
        )}
        <TapGestureHandler
          onActivated={handleItemTap}
          maxDeltaX={10}
          maxDeltaY={10}
          simultaneousHandlers={panRef}
        >
          <Animated.View style={[styles.overlay, animatedStyle]}>
            {children}
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}

function SwipeableButton({
  style,
  children,
  onPress,
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactElement;
  onPress: () => void;
}) {
  const handleSingleTap = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <TapGestureHandler onActivated={handleSingleTap}>
      <View style={style}>{children}</View>
    </TapGestureHandler>
  );
}

SwipableItem.Button = SwipeableButton;

const styles = StyleSheet.create({
  container: {},
  overlay: {},
  rightActions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
  leftActions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
});
