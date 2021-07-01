/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, FC, useMemo, useCallback } from 'react';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { SwipeableContext } from './useSwipeableContext';

const defaultSpringConfigs = {
  overshootClamping: true,
};

type Props = {
  children: ReactElement;
};

function SwipeableContainer({ children }: Props) {
  const translateX = useSharedValue(0);
  const swipeableState = useSharedValue<'closed' | 'opened'>('closed');

  const close = useCallback(() => {
    'worklet';

    if (swipeableState.value === 'opened') {
      translateX.value = withSpring(0, defaultSpringConfigs);
      swipeableState.value = 'closed';
    }
  }, []);

  const context = useMemo(
    () => ({
      translateX,
      swipeableState,
      close,
    }),
    []
  );

  return (
    <SwipeableContext.Provider value={context}>
      {children}
    </SwipeableContext.Provider>
  );
}

export default function withSwipeableContext<T>(Component: FC<T>) {
  return (props: T) => (
    <SwipeableContainer>
      <Component {...props} />
    </SwipeableContainer>
  );
}
