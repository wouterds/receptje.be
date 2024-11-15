import { useEffect, useState } from 'react';

import { useFingerprint } from './use-fingerprint';

export const useUser = () => {
  const [user, setUser] = useState<{ id: string } | null>(null);
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
      .then((data) => setUser(data));
  }, [fingerprint]);

  return { user };
};
