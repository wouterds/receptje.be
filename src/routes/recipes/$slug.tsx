import { TbClock, TbUsers } from 'react-icons/tb';
import { data, LoaderFunctionArgs, MetaFunction, redirect } from 'react-router';
import { useLoaderData } from 'react-router';

import { Header } from '~/components/header';
import { Recipes } from '~/database';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const identifier = params.slug?.split('-')?.pop();
  const recipe = await Recipes.getById(identifier);
  if (!recipe) {
    throw new Response('Recept niet gevonden', { status: 404 });
  }

  const slug = `${recipe.identifier}-${recipe.id}`;
  if (params.slug !== slug) {
    throw redirect(`/recepten/${slug}`);
  }

  return data({ recipe, url: request.url });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.recipe) {
    return [{ title: 'Recept niet gevonden - Receptje' }];
  }

  return [
    { title: `${data.recipe.name} - Receptje.be` },
    { name: 'description', content: data.recipe.description },
    { property: 'og:title', content: data.recipe.name },
    { property: 'og:description', content: data.recipe.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: data.url },
    { property: 'og:image', content: new URL('/og.png', data.url).toString() },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: data.recipe.name },
    { name: 'twitter:description', content: data.recipe.description },
    { name: 'twitter:image', content: new URL('/og.png', data.url).toString() },
  ];
};

export default function RecipeDetail() {
  const { recipe } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 py-6">
      <Header />

      <main className="px-6 sm:px-10 text-black/80">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-xl font-semibold">{recipe.name}</h1>
        </div>

        <div className="flex gap-4 mb-6">
          <p className="flex items-center gap-2">
            <TbUsers className="text-rose-500 text-lg" />
            <span>
              <span className="font-medium">{recipe.portions}</span>{' '}
              {recipe.portions === 1 ? 'portie' : 'porties'}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <TbClock className="text-rose-500 text-lg" />
            <span>
              <span className="font-medium">{recipe.preparationTime}</span> minuten
            </span>
          </p>
        </div>

        <div className="mb-6">
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
