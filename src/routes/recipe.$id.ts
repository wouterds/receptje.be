import { type ActionFunctionArgs } from 'react-router';

import { Recipes, Users } from '~/database';
import { Cookies } from '~/services';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (!params.id) {
    throw Response.json({ error: 'Bad request' }, { status: 400 });
  }

  if (request.method !== 'DELETE') {
    throw Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const userId = await Cookies.userId.parse(request.headers.get('cookie'));
  const user = await Users.get(userId);
  if (!user) {
    throw Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const recipe = await Recipes.getById(params.id);
  if (!recipe) {
    throw Response.json({ error: 'Not found' }, { status: 404 });
  }

  if (recipe.userId.toString() !== user.id.toString()) {
    throw Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await Recipes.deleteById(params.id);

  return Response.json({ success: true }, { status: 200 });
};
