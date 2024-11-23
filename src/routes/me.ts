import { LoaderFunctionArgs } from 'react-router';

import { Recipes, Users } from '~/database';
import { Cookies } from '~/services';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = await Cookies.userId.parse(request.headers.get('Cookie'));
  if (!cookie) {
    return Response.json({}, { status: 204 });
  }

  const user = await Users.get(cookie.toString());
  if (!user) {
    return Response.json({}, { status: 204 });
  }

  const recipes = await Recipes.getByUserId(user.id);

  return Response.json({ user, recipes });
};
