import { Link } from '@remix-run/react';
import clsx from 'clsx';

import { useMe } from '~/hooks';

import { SearchRecipe } from './search-recipe';

type Props = {
  autoFocus?: boolean;
};

export const Header = ({ autoFocus }: Props) => {
  const { recipes } = useMe();

  console.log(recipes);

  return (
    <header className="px-6 sm:px-10 flex justify-between items-center">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 flex-1">
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="Receptje.be" className="h-8" />
        </Link>
        <SearchRecipe autoFocus={autoFocus} />
      </div>
      <nav className="text-sm font-semibold text-black/80 flex-shrink-0 -m-4 lg:block hidden">
        <Link to="/mijn-receptjes" className="relative transition-opacity hover:opacity-80 p-4">
          Mijn receptjes
          <span
            className={clsx(
              'absolute right-0 top-1 min-w-4 h-4 p-1 bg-rose-500 rounded-full text-rose-50 flex items-center justify-center text-[10px]',
              { hidden: !recipes.length },
            )}>
            {recipes.length}
          </span>
        </Link>
      </nav>
    </header>
  );
};
