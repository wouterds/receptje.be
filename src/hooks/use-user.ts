import { useEffect, useState } from 'react';

export const useUser = () => {
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    fetch('/users', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return { user };
};
