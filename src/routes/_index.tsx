import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Link, useFetcher } from '@remix-run/react';
import { useState } from 'react';

import { SearchRecipe } from '~/components/search-recipe';
import { useUser } from '~/hooks';
import { OpenAI } from '~/services/openai.server';

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
    { property: 'og:image', content: new URL('/og.jpg', data?.url).toString() },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Receptje' },
    { name: 'twitter:description', content: 'Vind je receptje in 1 2 3 op Receptje.be!' },
    { name: 'twitter:image', content: new URL('/og.jpg', data?.url).toString() },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const q = formData.get('q') as string;

  return { recipe: await OpenAI.searchRecipe(q), q };
};

export default function Index() {
  useUser();

  const fetcher = useFetcher<typeof action>();
  const data = fetcher.data;
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 py-6 sm:py-8">
      <header className="px-6 sm:px-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="Receptje.be" className="h-8" />
        </Link>
        <SearchRecipe fetcher={fetcher} />
      </header>
      <main className="px-6 sm:px-8 text-slate-800">
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
