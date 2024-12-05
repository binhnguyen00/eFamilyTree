import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'zmp-ui';
import { useRecoilValue } from 'recoil';
import { swipeDisabledPathsAtom } from 'states';

export default function SwipeGesture({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const swipeDisabledPaths = useRecoilValue(swipeDisabledPathsAtom);
  const isSwipeDisabled = swipeDisabledPaths.includes(location.pathname);

  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (!isSwipeDisabled && location.pathname !== '/') {
        navigate(-1);
      }
    },
    onTouchStartOrOnMouseDown: (({ event }) => {
      if (isSwipeDisabled) event.preventDefault();
    }),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div id="swipe-gesture" {...(isSwipeDisabled ? {} : handlers)}>
      {children}
    </div>
  );
}