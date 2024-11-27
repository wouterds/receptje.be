import { IconClock, IconTrashX, IconUsers } from '@tabler/icons-react';
import clsx from 'clsx';
import { MouseEvent, useState } from 'react';
import { Trans } from 'react-i18next';
import { Link, useRevalidator } from 'react-router';

import { Recipe } from '~/database';

type Props = {
  recipe: Recipe;
};

export const Card = ({ recipe }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { revalidate } = useRevalidator();

  const onDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    const minDuration = new Promise((resolve) => setTimeout(resolve, 600));

    Promise.all([fetch(`/recipes/${recipe.id}`, { method: 'DELETE' }), minDuration]).then(
      revalidate,
    );
  };

  return (
    <Link
      to={`/recepten/${recipe.identifier}-${recipe.id}`}
      className="flex flex-col gap-2 p-4 rounded-lg bg-white/50 hover:bg-white/70 border border-black/5 hover:border-black/10 transition-colors group relative">
      <button
        type="button"
        onClick={onDeleteClick}
        className={clsx(
          'absolute top-3 right-3 text-black hover:bg-tint rounded transition-all p-1.5 group/button opacity-0 group-hover:opacity-100',
          {
            'bg-tint': isDeleting,
          },
        )}>
        <IconTrashX
          className={clsx('w-4 h-4', {
            'opacity-50 group-hover/button:opacity-70': !isDeleting,
            'opacity-0': isDeleting,
          })}
        />
        {isDeleting && (
          <div className="overflow-hidden inset-0 absolute flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-3.5 w-3.5"
              viewBox="0 0 24 24">
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-40"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}
      </button>
      <h2 className="font-medium text-black/80 transition-colors">{recipe.name}</h2>
      <p className="text-sm text-black/60 line-clamp-2">{recipe.description}</p>
      <div className="flex gap-4 mt-1 text-sm text-black/60">
        <span className="flex items-center gap-1">
          <IconUsers className="text-rose-500 h-4 w-4" />
          <Trans
            i18nKey="labels.portions"
            count={recipe.portions}
            components={[<span className="font-medium" key="count" />]}
          />
        </span>
        <span className="flex items-center gap-1">
          <IconClock className="text-rose-500 h-4 w-4" />
          <Trans
            i18nKey="labels.minutes"
            count={recipe.preparationTime}
            components={[<span className="font-medium" key="count" />]}
          />
        </span>
      </div>
    </Link>
  );
};
