import { IconMenuDeep } from '@tabler/icons-react';
import clsx from 'clsx';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useRouteLoaderData } from 'react-router';

import { useMe } from '~/hooks';
import { loader } from '~/root';

export const Header = () => {
  const { t } = useTranslation();

  const { recipes } = useMe();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const data = useRouteLoaderData<typeof loader>('root');

  const handleMouseEnter = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  const handleItemClick = useCallback(() => {
    buttonRef.current?.blur();
    menuRef.current?.blur();
  }, []);

  const foreignVisitor = useMemo(() => {
    if (!data?.country?.code || !data?.locale) {
      return false;
    }

    return !['BE', 'NL'].includes(data.country.code) && data.locale.toLowerCase() !== 'nl';
  }, [data]);

  return (
    <header>
      {foreignVisitor && (
        <div className="bg-[#FBFAFA] border-b border-black/5 text-black/70 py-4 px-6 sm:px-10 text-sm">
          {t('components.header.foreign-visitor', {
            country: data!.country.name,
            flag: getCountryFlag(data!.country.code),
          })}
        </div>
      )}

      <div className="py-6 px-6 sm:px-10 flex justify-between items-center gap-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 flex-1">
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.svg" alt="Receptje.be" className="h-8" />
          </Link>
        </div>
        <nav className="text-sm font-semibold text-black/80 flex-shrink-0 relative">
          <button ref={buttonRef} className="-m-4 p-4 hover:opacity-80 sm:hidden peer relative">
            <IconMenuDeep className="h-6 w-6" />
            {!!recipes.length && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-3 right-3" />
            )}
          </button>
          <div
            className="absolute right-0 pt-1 origin-top-right sm:relative sm:visible peer-hover:visible opacity-0 sm:opacity-100 peer-hover:opacity-100 transition-opacity hover:visible hover:opacity-100 pointer-events-none peer-hover:pointer-events-auto hover:pointer-events-auto sm:pointer-events-auto"
            ref={menuRef}>
            <div className="rounded-lg p-1.5 sm:p-0 bg-[#FBFAFA] shadow-lg shadow-black/5 ring-1 ring-black/5 sm:bg-transparent sm:shadow-none sm:ring-0 flex flex-col sm:flex-row">
              <Link
                to="/"
                onClick={handleItemClick}
                className="px-4 py-2.5 sm:py-4 flex items-center gap-1.5 cursor-pointer mr-2 sm:mr-0 hover:opacity-80 transition-opacity text-nowrap">
                {t('components.header.search')}
              </Link>
              <Link
                to="/mijn-recepten"
                className="group pr-2 sm:pr-0"
                onClick={handleItemClick}
                onMouseEnter={handleMouseEnter}>
                <div className="relative transition-opacity hover:opacity-80 px-4 py-2.5 sm:py-4 flex items-center gap-1.5 cursor-pointer text-nowrap">
                  {t('components.header.my-recipes')}
                  <span
                    className={clsx(
                      'absolute right-0 -top-1 sm:top-1 min-w-4 h-4 p-1 bg-rose-500 rounded-full text-rose-50 flex items-center justify-center text-[10px] font-medium',
                      { hidden: !recipes.length },
                    )}>
                    {recipes.length}
                  </span>
                </div>
                <div className="absolute right-0 pt-1 w-80 origin-top-right invisible sm:group-hover:visible opacity-0 sm:group-hover:opacity-100 transition-all">
                  <div className="rounded-lg bg-[#FBFAFA] shadow-lg shadow-black/5 ring-1 ring-black/5 relative">
                    <div ref={scrollContainerRef} className="p-2 max-h-[70vh] overflow-y-auto">
                      {recipes.length === 0 ? (
                        <p className="text-xs text-black/60 p-3">
                          {t('components.header.my-recipes-empty')}
                        </p>
                      ) : (
                        recipes.map((recipe) => (
                          <Link
                            key={recipe.id}
                            to={`/recepten/${recipe.identifier}-${recipe.id}`}
                            onClick={handleItemClick}
                            className="flex flex-col gap-0.5 p-3 rounded-md hover:bg-tint group/item transition-colors">
                            <span className="font-medium text-sm group-hover/item:text-rose-500 transition-colors">
                              {recipe.name}
                            </span>
                            <span className="text-xs text-black/60 line-clamp-2">
                              {recipe.description}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                    {recipes?.length > 3 && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/50 to-transparent pointer-events-none rounded-b-lg" />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

const getCountryFlag = (countryCode?: string) => {
  return countryCode
    ?.toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('');
};
