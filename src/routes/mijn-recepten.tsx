import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { TbClock, TbUsers } from 'react-icons/tb';

import { Header } from '~/components/header';
import { Recipes, Users } from '~/database';
import { Cookies } from '~/services';

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
      id: recipe.id.short,
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
              <Link
                key={recipe.id}
                to={`/recepten/${recipe.identifier}-${recipe.id}`}
                className="flex flex-col gap-2 p-4 rounded-lg bg-white/50 border border-black/5 hover:border-black/10 transition-colors group">
                <h2 className="font-medium text-black/80 group-hover:text-rose-500 transition-colors">
                  {recipe.name}
                </h2>
                <p className="text-sm text-black/60 line-clamp-2">{recipe.description}</p>
                <div className="flex gap-4 mt-1 text-sm text-black/60">
                  <span className="flex items-center gap-1">
                    <TbUsers className="text-rose-500 text-base" />
                    <span className="font-medium">{recipe.portions}</span> porties
                  </span>
                  <span className="flex items-center gap-1">
                    <TbClock className="text-rose-500 text-base" />
                    <span className="font-medium">{recipe.preparationTime}</span> minuten
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
