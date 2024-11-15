import { ActionFunctionArgs } from '@remix-run/node';

import { Users } from '~/database';
import { Cookies } from '~/services';

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookie = await Cookies.userId.parse(request.headers.get('Cookie'));
  if (cookie) {
    const user = await Users.get(cookie.toString());
    if (user) {
      return Response.json(
        { id: user.id.short },
        { headers: { 'Set-Cookie': await Cookies.userId.serialize(user.id.short) } },
      );
    }
  }

  const data = await request.json();
  const fingerprint = data.fingerprint as string;
  if (fingerprint?.length !== 32) {
    throw Response.json({ error: 'Bad request' }, { status: 400 });
  }

  const user = await Users.add({ fingerprint });
  if (!user) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }

  return Response.json(
    { id: user.id.short },
    { headers: { 'Set-Cookie': await Cookies.userId.serialize(user.id.short) } },
  );
};
