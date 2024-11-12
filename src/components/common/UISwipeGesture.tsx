import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useLocation } from 'react-router-dom';

const UISwipeGesture = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (location.pathname !== '/') {
        navigate(-1);
      }
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div {...handlers} style={{ height: '100vh' }}>
      {children}
    </div>
  );
};

export default UISwipeGesture;
