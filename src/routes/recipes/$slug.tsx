import { IconClock, IconShare, IconUsers } from '@tabler/icons-react';
import i18next from 'i18next';
import { Trans, useTranslation } from 'react-i18next';
import { data, LoaderFunctionArgs, MetaFunction, redirect } from 'react-router';
import { useLoaderData } from 'react-router';

import { Recipes } from '~/database';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const identifier = params.slug?.split('-')?.pop();
  const recipe = await Recipes.getById(identifier);
  if (!recipe) {
    throw new Response(i18next.t('errors.recipe-not-found'), { status: 404 });
  }

  const slug = `${recipe.identifier}-${recipe.id}`;
  if (params.slug !== slug) {
    throw redirect(`/recepten/${slug}`);
  }

  return data({ recipe, url: request.url });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.recipe) {
    return [{ title: i18next.t('errors.recipe-not-found') }];
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
  const { recipe, url } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <div className="max-w-xl w-full sm:my-6 mx-auto bg-white/50 border border-black/5 rounded-lg p-6 sm:p-8 relative group">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-xl font-semibold">{recipe.name}</h1>
        {typeof window !== 'undefined' && typeof navigator?.share === 'function' && (
          <button
            onClick={() => navigator.share({ title: recipe.name, url })}
            className="text-black/70 rounded transition-all px-2.5 py-1.5 -my-0.5 bg-tint hover:bg-tint-dark text-sm items-center gap-1.5 invisible group-hover:visible opacity-0 group-hover:opacity-100 focus:visible focus:opacity-100 hidden sm:inline-flex">
            <IconShare className="w-4 h-4" />
            {t('labels.share')}
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <p className="flex items-center gap-2">
          <IconUsers className="text-rose-500 h-5 w-5" />
          <span>
            <Trans
              i18nKey="labels.portions"
              count={recipe.portions}
              components={[<span className="font-medium" key="count" />]}
            />
          </span>
        </p>
        <p className="flex items-center gap-2">
          <IconClock className="text-rose-500 h-5 w-5" />
          <span>
            <Trans
              i18nKey="labels.minutes"
              count={recipe.preparationTime}
              components={[<span className="font-medium" key="count" />]}
            />
          </span>
        </p>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">{t('labels.ingredients')}</h2>
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
        <h2 className="font-bold text-lg mb-2">{t('labels.preparation')}</h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="font-medium text-rose-500">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
