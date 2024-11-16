import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { LuClock, LuShare2, LuUser2 } from 'react-icons/lu';

import { Recipes } from '~/database';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const identifier = params.slug?.split('-')?.pop() || '';
  if (!identifier) {
    throw new Response('Recept niet gevonden', { status: 404 });
  }

  const recipe = await Recipes.getById(identifier);
  if (!recipe) {
    throw new Response('Recept niet gevonden', { status: 404 });
  }

  const slug = `${recipe.identifier}-${recipe.id.short}`;
  if (params.slug !== slug) {
    throw redirect(`/recepten/${slug}`);
  }

  return {
    recipe,
    url: request.url,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.recipe) {
    return [{ title: 'Recept niet gevonden - Receptje' }];
  }

  return [
    { title: `${data.recipe.name} - Receptje` },
    { name: 'description', content: `Recept voor ${data.recipe.name}` },
    // Open Graph tags
    { property: 'og:title', content: data.recipe.name },
    { property: 'og:description', content: `Recept voor ${data.recipe.name}` },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: data.url },
    { property: 'og:image', content: new URL('/og.png', data.url).toString() },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: data.recipe.name },
    { name: 'twitter:description', content: `Recept voor ${data.recipe.name}` },
    { name: 'twitter:image', content: new URL('/og.png', data.url).toString() },
  ];
};

export default function RecipeDetail() {
  const { recipe, url } = useLoaderData<typeof loader>();

  const shareData = {
    title: `${recipe.name} - Receptje`,
    text: `Bekijk dit recept voor ${recipe.name}`,
    url: url,
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        // You might want to add a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 py-6">
      <header className="px-6 sm:px-10 flex justify-between items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 flex-1">
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.svg" alt="Receptje.be" className="h-8" />
          </Link>
        </div>
      </header>

      <main className="px-6 sm:px-10 text-slate-800">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-xl font-semibold">{recipe.name}</h1>
          <button
            onClick={handleShare}
            className="p-2 text-slate-600 hover:text-slate-800 transition-colors"
            aria-label="Deel recept">
            <LuShare2 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-4 mb-3">
          <p className="flex items-center gap-2">
            <LuUser2 className="text-rose-500 text-lg" />
            <span>
              <span className="font-medium">{recipe.portions}</span>{' '}
              {recipe.portions === 1 ? 'portie' : 'porties'}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <LuClock className="text-rose-500 text-lg" />
            <span>
              <span className="font-medium">{recipe.preparationTime}</span> minuten
            </span>
          </p>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2">Ingrediënten</h2>
          <ul className="space-y-2 list-disc list-inside">
            {recipe.ingredients.map((ingredient, index) => (
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
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-medium text-rose-500">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
