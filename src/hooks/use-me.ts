import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { Recipe, User } from '~/database';

export const useMe = () => {
  const [me, setMe] = useState<{ user: User | null; recipes: Recipe[] }>({
    user: null,
    recipes: [],
  });

  const { pathname } = useLocation();

  useEffect(() => {
    fetch('/me')
      .then((res) => res.json())
      .then((data) => setMe(data));
  }, [pathname]);

  return me;
};
