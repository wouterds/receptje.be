import { Link } from '@remix-run/react';
import { useRef } from 'react';

import { useMe } from '~/hooks';

export const RecipesDropdown = () => {
  const { recipes } = useMe();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  if (!recipes.length) {
    return null;
  }

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter}>
      <div className="relative transition-opacity hover:opacity-80 p-4 flex items-center gap-1.5 cursor-pointer">
        Mijn receptjes
        <span className="absolute right-0 top-1 min-w-4 h-4 p-1 bg-rose-500 rounded-full text-rose-50 flex items-center justify-center text-[10px]">
          {recipes.length}
        </span>
      </div>
      <div className="absolute right-0 pt-1 w-80 origin-top-right invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
        <div className="rounded-lg bg-[#FBFAFA] shadow-lg shadow-black/5 ring-1 ring-black/5 relative">
          <div ref={scrollContainerRef} className="p-2 max-h-[70vh] overflow-y-auto">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recepten/${recipe.identifier}-${recipe.id}`}
                className="flex flex-col gap-0.5 p-3 rounded-md hover:bg-tint group/item transition-colors">
                <span className="font-medium text-sm group-hover/item:text-rose-500 transition-colors">
                  {recipe.name}
                </span>
                <span className="text-xs text-black/60 line-clamp-2">{recipe.description}</span>
              </Link>
            ))}
          </div>
          {recipes?.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/50 to-transparent pointer-events-none rounded-b-lg" />
          )}
        </div>
      </div>{' '}
    </div>
  );
};
