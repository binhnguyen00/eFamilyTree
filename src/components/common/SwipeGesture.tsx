import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'zmp-ui';

export default function SwipeGesture({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      if (location.pathname !== '/') {
        navigate(-1);
      }
    },
    onTouchStartOrOnMouseDown: (({ event }) => event.preventDefault()),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div id='swipe-gesture' {...handlers}>
      {children}
    </div>
  );
};