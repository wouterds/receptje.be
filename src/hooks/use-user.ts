import { useEffect, useState } from 'react';

import type { User } from '~/database';

import { useFingerprint } from './use-fingerprint';
import { useLocalStorage } from './use-local-storage';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useLocalStorage('user.id');
  const { fingerprint } = useFingerprint();

  useEffect(() => {
    if (fingerprint && !userId) {
      fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user.id);
        });
    }

    if (userId) {
      fetch(`/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
        });
    }
  }, [userId, fingerprint]);

  useEffect(() => {
    if (user) {
      setUserId(user.id.toString());
    }
  }, [user, setUserId]);

  return { user };
};
