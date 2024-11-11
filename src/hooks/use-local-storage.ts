import { useEffect, useState } from 'react';

export const useLocalStorage = (key: string) => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    setValue(localStorage.getItem(key));
  }, [key, setValue]);

  const setValueProxy = (value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  return [value, setValueProxy] as const;
};
