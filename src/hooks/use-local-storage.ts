import { useEffect, useState } from 'react';

export const useLocalStorage = (key: string) => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const value = localStorage.getItem(key);
    setValue(value);
  }, [key]);

  return [value, setValue] as const;
};
