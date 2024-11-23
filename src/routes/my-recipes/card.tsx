import clsx from 'clsx';
import { MouseEvent, useState } from 'react';
import { TbClock, TbTrash, TbUsers } from 'react-icons/tb';
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
        <TbTrash
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
          <TbUsers className="text-rose-500 text-base" />
          <span className="font-medium">{recipe.portions}</span> porties
        </span>
        <span className="flex items-center gap-1">
          <TbClock className="text-rose-500 text-base" />
          <span className="font-medium">{recipe.preparationTime}</span> minuten
        </span>
      </div>
    </Link>
  );
};
