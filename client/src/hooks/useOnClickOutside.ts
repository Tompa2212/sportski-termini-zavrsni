import React, { useEffect, useRef } from 'react';

export const useOnClickOutside = (
  itemRef: React.MutableRefObject<any>,
  callback: (...args: any[]) => void
) => {
  const callbackRef = useRef<typeof callback>();
  callbackRef.current = callback;

  useEffect(() => {
    const handleClickOutside = (e: WindowEventMap['mousedown']) => {
      if (!itemRef?.current?.contains(e.target) && callbackRef.current) {
        callbackRef.current();
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [itemRef, callbackRef]);
};
