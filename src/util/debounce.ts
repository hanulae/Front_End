import {useEffect} from 'react';

export const useDebouncedEffect = (
  callback: () => void,
  deps: any[],
  delay: number,
) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(handler);
  }, [...deps, delay]);
};
