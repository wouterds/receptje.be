import { type ActionFunctionArgs } from '@remix-run/node';

import { Users } from '~/database';
import { Cookies, OpenAI } from '~/services';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const q = formData.get('q') as string;
  if (!q) {
    throw new Response('Bad request', { status: 400 });
  }

  const userId = await Cookies.userId.parse(request.headers.get('cookie'));
  const user = await Users.get(userId);
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const recipe = await OpenAI.searchRecipe(q, userId);

  return { recipe, q };
};
