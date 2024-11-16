import { FetcherWithComponents, Link } from '@remix-run/react';
import clsx from 'clsx';

import { action } from '~/routes/search';

import { SearchRecipe } from './search-recipe';

interface HeaderProps {
  fetcher: FetcherWithComponents<Awaited<ReturnType<typeof action>>>;
}

export const Header = ({ fetcher }: HeaderProps) => {
  return (
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
  );
};
