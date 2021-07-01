import { createContext, useContext } from 'react';
import type Animated from 'react-native-reanimated';

type SwipeableContextType = {
  translateX: Animated.SharedValue<number>;
  swipeableState: Animated.SharedValue<'closed' | 'opened'>;
  close: () => void;
};

// @ts-ignore
export const SwipeableContext = createContext<SwipeableContextType>();

export default function useSwipeableContext() {
  const ctx = useContext(SwipeableContext);
  if (!ctx) {
    throw new Error('Component should be wrapped by withSwipeableContext');
  }
  return ctx;
}
