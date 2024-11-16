import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { LuClock, LuUser2 } from 'react-icons/lu';

import { Header } from '~/components/header';
import { useUser } from '~/hooks';

import { action } from './search';

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

export default function Index() {
  useUser();

  const fetcher = useFetcher<typeof action>();
  const data = fetcher.data;

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 py-6">
      <Header fetcher={fetcher} />
      <main className="px-6 sm:px-10 text-slate-800">
        {data?.recipe && (
          <>
            <h1 className="text-xl font-semibold mb-1">{data.recipe.name}</h1>

            <div className="flex gap-4 mb-3">
              <p className="flex items-center gap-2">
                <LuUser2 className="text-rose-500 text-lg" />
                <span>
                  <span className="font-medium">{data.recipe.portions}</span>{' '}
                  {data.recipe.portions === 1 ? 'portie' : 'porties'}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <LuClock className="text-rose-500 text-lg" />
                <span>
                  <span className="font-medium">{data.recipe.preparationTime}</span> minuten
                </span>
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
