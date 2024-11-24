import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useFetcher } from 'react-router';

import { useUser } from '~/hooks';
import { action } from '~/routes/search';

const SUGGESTIONS = [
  'Flatbread (griekse yoghurt) voor 2',
  'Moscow Mule',
  'Ragù',
  'Zweedse kladdkaka',
  'Pannekoeken 1 ei',
  'Vegi lasagne met feta 4 personen',
];

export const SearchRecipe = () => {
  useUser();
  const [query, setQuery] = useState('');
  const fetcher = useFetcher<typeof action>();
  const isLoading = fetcher.state === 'submitting';
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);

  const handleSuggestionClick = async (suggestion: string) => {
    setIsSuggestionClicked(true);
    if (inputRef.current) {
      inputRef.current.value = suggestion;
      setQuery('');

      for (let i = 0; i <= suggestion.length; i++) {
        setQuery(suggestion.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      formRef.current?.requestSubmit();
    }
  };

  return (
    <fetcher.Form
      ref={formRef}
      method="post"
      action="/search"
      className="w-full max-w-xl py-1"
      onSubmit={() => {
        inputRef.current?.blur();
      }}>
      <div className="flex items-center gap-3 sm:gap-4">
        <input
          ref={inputRef}
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
      </div>
      <ul
        className={clsx('flex gap-1.5 mt-4 flex-wrap transition-all', {
          'opacity-0': isSuggestionClicked,
          'opacity-100': !isSuggestionClicked,
        })}>
        {SUGGESTIONS.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-sm text-black/60 hover:text-rose-500 bg-white/50 hover:bg-white/70 px-3 py-1 rounded-full border border-black/5 hover:border-black/10 transition-colors">
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </fetcher.Form>
  );
};
