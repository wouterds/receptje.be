import clsx from 'clsx';
import { useRef } from 'react';
import { useFetcher } from 'react-router';

import { useUser } from '~/hooks';
import { action } from '~/routes/search';

export const SearchRecipe = () => {
  useUser();

  const fetcher = useFetcher<typeof action>();
  const isLoading = fetcher.state === 'submitting';
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <fetcher.Form
      method="post"
      action="/search"
      className="flex items-center gap-3 sm:gap-4 w-full max-w-xl py-1"
      onSubmit={() => {
        inputRef.current?.blur();
      }}>
      <input
        ref={inputRef}
        type="text"
        name="q"
        className="border border-black/10 rounded-full flex-1 text-black/80 text-sm px-4 py-2 sm:px-6 sm:py-3 bg-white/50 placeholder:text-black/50 hover:bg-white/70 hover:border-black/15 transition-colors"
        placeholder="Zoek een receptje"
        autoFocus
        tabIndex={1}
        autoComplete="off"
      />
      <button
        tabIndex={2}
        className={clsx(
          'bg-rose-500 transition-colors text-tint font-semibold text-sm rounded-full inline-block relative px-4 py-2 sm:px-6 sm:py-3',
          {
            'cursor-progress': isLoading,
            'hover:bg-rose-600': !isLoading,
          },
        )}
        type="submit"
        disabled={isLoading}>
        <span className={clsx({ 'opacity-0': isLoading })}>Zoek</span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </button>
    </fetcher.Form>
  );
};
