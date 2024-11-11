import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';

import { Users } from '~/database';
import { Cookies } from '~/services';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = await Cookies.userId.parse(request.headers.get('Cookie'));
  if (!cookie) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await Users.get(cookie);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  return json({ user: { id: user.encodedId, createdAt: user.createdAt } });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookie = await Cookies.userId.parse(request.headers.get('Cookie'));
  if (cookie) {
    const user = await Users.get(cookie);
    if (user) {
      return json(
        { user: { id: user.encodedId, createdAt: user.createdAt } },
        { headers: { 'Set-Cookie': await Cookies.userId.serialize(user.id) } },
      );
    }
  }

  const data = await request.json();
  const fingerprint = data.fingerprint as string;
  if (fingerprint?.length !== 32) {
    throw json({ error: 'Bad request' }, { status: 400 });
  }

  const user = await Users.add({ fingerprint });
  if (!user) {
    return json({ error: 'Internal server error' }, { status: 500 });
  }

  return json(
    { user: { id: user.encodedId, createdAt: user.createdAt } },
    { headers: { 'Set-Cookie': await Cookies.userId.serialize(user.id) } },
  );
};
