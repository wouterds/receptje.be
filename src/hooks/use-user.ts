import { useEffect, useState } from 'react';

import type { TransformedUser } from '~/database';

import { useFingerprint } from './use-fingerprint';
import { useLocalStorage } from './use-local-storage';

const createUser = async (fingerprint: string) => {
  return fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fingerprint }),
  }).then((res) => res.json());
};

export const useUser = () => {
  const [user, setUser] = useState<TransformedUser | null>(null);
  const [userId, setUserId] = useLocalStorage('user.id');
  const { fingerprint } = useFingerprint();

  useEffect(() => {
    if (!fingerprint) {
      return;
    }

    if (!userId) {
      createUser(fingerprint).then((data) => setUser(data.user));
    }

    if (userId) {
      fetch(`/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            return;
          }

          createUser(fingerprint).then((data) => setUser(data.user));
        })
        .catch(() => {
          createUser(fingerprint).then((data) => setUser(data.user));
        });
    }
  }, [userId, fingerprint]);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user, setUserId]);

  return { user };
};
