import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { TbClock, TbTrash, TbUsers } from 'react-icons/tb';

import { Header } from '~/components/header';
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

  return {
    recipes: recipes.map((recipe) => ({
      ...recipe,
      id: recipe.id.short!,
    })),
  };
};

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: 'Mijn recepten - Receptje' }];
};

export default function MyRecipes() {
  const { recipes } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 py-6">
      <Header />

      <main className="px-6 sm:px-10">
        <h1 className="text-xl font-semibold mb-4 sm:mb-6 text-black/80">Mijn recepten</h1>

        {recipes.length === 0 ? (
          <p className="text-black/80">Je hebt precies nog geen recepten opgezocht. 🥺</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Card key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
