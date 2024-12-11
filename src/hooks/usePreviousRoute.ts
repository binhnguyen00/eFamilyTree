import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function usePreviousRoute() {
  const location = useLocation();
  const prevLocationRef = useRef(location);
  
  useEffect(() => {
    prevLocationRef.current = location;
  }, [location]);

  return prevLocationRef.current;
}