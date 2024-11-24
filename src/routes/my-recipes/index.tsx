import { IconMoodEmpty } from '@tabler/icons-react';
import { LoaderFunctionArgs, MetaFunction, redirect, useLoaderData } from 'react-router';

import { Recipes, Users } from '~/database';
import { Cookies } from '~/services';

import { Card } from './card';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = await Cookies.userId.parse(request.headers.get('Cookie'));
  if (!cookie) {
    throw redirect('/');
  }

  const user = await Users.get(cookie.toString());
  if (!user) {
    throw redirect('/');
  }

  const recipes = await Recipes.getByUserId(user.id);

  return { recipes };
};

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: 'Mijn recepten - Receptje' }];
};

export default function MyRecipes() {
  const { recipes } = useLoaderData<typeof loader>();

  if (recipes.length === 0) {
    return (
      <div className="max-w-lg m-12 mx-auto bg-white/50 border border-black/5 rounded-lg p-8">
        <p className="text-black/60 text-center text-sm font-medium">
          Je hebt precies nog geen recepten opgezocht.
          <br />
          <IconMoodEmpty className="opacity-50 text-center mx-auto mt-4" />
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold mb-4 sm:mb-6 text-black/80">Mijn recepten</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Card key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
}
