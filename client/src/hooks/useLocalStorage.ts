import React, { useEffect, useMemo, useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<T>] => {
  const readValue = useMemo(() => {
    try {
      const storageValue = localStorage.getItem(key);

      if (!storageValue) {
        return initialValue;
      }

      return JSON.parse(storageValue);
    } catch (error) {
      return initialValue;
    }
  }, [key, initialValue]);

  const [value, setValue] = useState<T>(readValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
