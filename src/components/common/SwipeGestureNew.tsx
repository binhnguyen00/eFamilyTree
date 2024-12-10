import React from 'react';
import { useGesture } from '@use-gesture/react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'zmp-ui';
import { useRecoilValue } from 'recoil';
import { swipeDisabledPathsAtom } from 'states';

interface SwipeGestureProps {
  children: React.ReactNode;
  swipeThreshold?: number; // Minimum distance to trigger swipe
  edgeWidth?: number; // Width of the edge area where swipe is active
}

export function SwipeGesture({ 
  children, 
  swipeThreshold = 50, 
  edgeWidth = 30 
}: SwipeGestureProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const swipeDisabledPaths = useRecoilValue(swipeDisabledPathsAtom);
  const isSwipeDisabled = swipeDisabledPaths.includes(location.pathname);

  // Create a ref to bind the gesture to
  const bindGesture = useGesture(
    {
      // Handler for drag gesture
      onDrag: ({ movement: [mx], initial: [x0], cancel, canceled }) => {
        // If swipe is disabled or we're on the home page, ignore the gesture
        if (isSwipeDisabled || location.pathname === '/' || x0 > edgeWidth || canceled) {
          cancel();
          return;
        }

        // If we've dragged far enough to the right, navigate back
        if (mx > swipeThreshold) {
          navigate(-1);
          cancel();
        }
      },
      // Handler for touch start to check initial position
      onTouchStart: ({ event }) => {
        const touch = (event as TouchEvent).touches[0];
        if (touch.clientX > edgeWidth) {
          return false; // Prevents gesture from starting
        }
      },
      // Handler for mouse down to check initial position
      onMouseDown: ({ event }) => {
        const mouseEvent = event as MouseEvent;
        if (mouseEvent.clientX > edgeWidth) {
          return false; // Prevents gesture from starting
        }
      },
    },
    {
      // Configuration options
      drag: {
        filterTaps: true, // Ignore tap gestures
        threshold: 5, // Minimum movement before gesture starts
        axis: 'x', // Only track horizontal movement
        bounds: { left: 0 }, // Only allow rightward swipes
      },
      // Enable touch and mouse events
      enabled: !isSwipeDisabled,
    }
  );

  return (
    <div
      id="swipe-gesture"
      {...bindGesture()}
      style={{
        touchAction: 'pan-y', // Allow vertical scrolling
        userSelect: 'none', // Prevent text selection during swipe
      }}
    >
      {children}
    </div>
  );
}