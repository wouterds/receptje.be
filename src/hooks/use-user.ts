import { useEffect, useState } from 'react';

import { useFingerprint } from './use-fingerprint';
import { useLocalStorage } from './use-local-storage';

export const useUser = () => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [, setUserId] = useLocalStorage('userId');
  const { fingerprint } = useFingerprint();

  useEffect(() => {
    if (!fingerprint) {
      return;
    }

    fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data?.user || null);
      });
  }, [fingerprint]);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user, setUserId]);

  return { user };
};
