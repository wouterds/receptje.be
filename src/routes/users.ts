import { ActionFunctionArgs } from 'react-router';

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

  const user = await Users.add({});
  if (!user) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }

  return Response.json(
    { id: user.id.short },
    { headers: { 'Set-Cookie': await Cookies.userId.serialize(user.id.short) } },
  );
};
