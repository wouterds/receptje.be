import { type ActionFunctionArgs, redirect } from '@remix-run/node';

import { Users } from '~/database';
import { Cookies, OpenAI } from '~/services';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const q = formData.get('q') as string;
  if (!q) {
    return redirect('/');
  }

  const userId = await Cookies.userId.parse(request.headers.get('cookie'));
  const user = await Users.get(userId);
  if (!user) {
    return redirect('/');
  }

  const recipe = await OpenAI.searchRecipe(q, userId);
  if (!recipe) {
    return redirect('/');
  }

  return redirect(`/recepten/${recipe?.identifier}-${recipe?.id}`);
};
