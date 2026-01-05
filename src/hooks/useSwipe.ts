import { useSwipeable } from 'react-swipeable';

export const useSwipe = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  return useSwipeable({
    onSwipedLeft: () => onSwipeLeft?.(),
    onSwipedRight: () => onSwipeRight?.(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });
};