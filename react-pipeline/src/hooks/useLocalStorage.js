import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const stored = localStorage.getItem(key);
  const parsed = stored ? JSON.parse(stored) : initialValue;

  const [value, setValue] = useState(parsed);

  localStorage.setItem(key, JSON.stringify(value));

  const setAndPersist = (newValue) => {
    setValue(newValue);
  };

  return [value, setAndPersist];
}
