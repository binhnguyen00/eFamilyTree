import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'zmp-ui';
import { useRecoilValue } from 'recoil';
import { swipeDisabledPathsAtom } from 'states';

/**
 * @PageDisable Disable swipe gesture on some path
 * @SwipeRange Can be swiped only on the left side of the screen. Swipe range is about 30px
 */
export default function SwipeGesture({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const swipeDisabledPaths = useRecoilValue(swipeDisabledPathsAtom);
  const isSwipeDisabled = swipeDisabledPaths.includes(location.pathname);

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      if (!isSwipeDisabled && location.pathname !== '/' && eventData.initial[0] <= 30) {
        navigate(-1);
      }
    },
    onTouchStartOrOnMouseDown: (({ event }) => {
      if (isSwipeDisabled) event.preventDefault();
      let clientX: number | undefined;
      // Handle TouchEvent
      if ((event as TouchEvent).changedTouches) {
        clientX = (event as TouchEvent).changedTouches[0].clientX;
      }
      // Handle MouseEvent
      else {
        clientX = (event as MouseEvent).clientX;
      }
      // Restrict gesture to the first 30px area
      if (clientX && clientX > 30) return;
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