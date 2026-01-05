import { useInView } from 'react-intersection-observer';

export const useIntersectionObserver = (options = {}) => {
  return useInView({
    threshold: 0.5,
    triggerOnce: true,
    ...options
  });
};