import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useFetcher } from '@remix-run/react';
import clsx from 'clsx';

import { SearchRecipe } from '~/components/search-recipe';
import { Users } from '~/database';
import { useUser } from '~/hooks';
import { Cookies, OpenAI } from '~/services';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    url: request.url,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: 'Receptje' },
    { name: 'description', content: 'Vind je receptje in 1 2 3 op Receptje.be!' },
    // Open Graph tags
    { property: 'og:title', content: 'Receptje' },
    { property: 'og:description', content: 'Vind je receptje in 1 2 3 op Receptje.be!' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: new URL('/og.png', data?.url).toString() },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Receptje' },
    { name: 'twitter:description', content: 'Vind je receptje in 1 2 3 op Receptje.be!' },
    { name: 'twitter:image', content: new URL('/og.png', data?.url).toString() },
  ];
};

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

  return { recipe: await OpenAI.searchRecipe(q, userId), q };
};

export default function Index() {
  useUser();

  const fetcher = useFetcher<typeof action>();
  const data = fetcher.data;

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 py-6">
      <header className="px-6 sm:px-10 flex justify-between items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 flex-1">
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.svg" alt="Receptje.be" className="h-8" />
          </Link>
          <SearchRecipe fetcher={fetcher} />
        </div>
        <nav className="text-sm font-semibold text-slate-800 flex-shrink-0 hidden">
          <Link to="/mijn-receptjes" className="relative hover:text-slate-600 transition-colors">
            Mijn receptjes
            <span
              className={clsx(
                'absolute -right-4 -top-2.5 min-w-4 h-4 p-1 bg-rose-500 rounded-full text-rose-50 flex items-center justify-center text-[10px]',
                {
                  hidden: 0 === 0,
                },
              )}>
              0
            </span>
          </Link>
        </nav>
      </header>
      <main className="px-6 sm:px-10 text-slate-800">
        {data?.recipe && (
          <>
            <h1 className="text-xl font-semibold mb-1">{data.recipe.name}</h1>

            <div className="flex gap-4 mb-3">
              <p>
                <span className="font-medium">{data.recipe.portions}</span>{' '}
                {data.recipe.portions === 1 ? 'portie' : 'porties'}
              </p>
              <p>
                <span className="font-medium">{data.recipe.preparationTime}</span> minuten
              </p>
            </div>

            <div className="mb-4">
              <h2 className="font-semibold text-lg mb-2">Ingrediënten</h2>
              <ul className="space-y-2 list-disc list-inside">
                {data.recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="marker:text-rose-500">
                    <span className="font-medium">
                      {ingredient.amount} {ingredient.unit}
                    </span>{' '}
                    <span>{ingredient.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">Bereiding</h2>
              <ol className="space-y-3">
                {data.recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="font-medium text-rose-500">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
