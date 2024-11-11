import { FetcherWithComponents } from '@remix-run/react';
import clsx from 'clsx';
import { useRef } from 'react';

type Props = {
  compact?: boolean;
  defaultValue?: string;
  fetcher: FetcherWithComponents<unknown>;
};

export const SearchRecipe = ({ compact, defaultValue, fetcher }: Props) => {
  const isLoading = fetcher.state === 'submitting';
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <fetcher.Form
      method="post"
      className="flex items-center gap-3 sm:gap-4 w-full py-1"
      onSubmit={() => {
        inputRef.current?.blur();
      }}>
      <input
        ref={inputRef}
        type="text"
        name="q"
        defaultValue={defaultValue}
        className={clsx('border rounded-full flex-1 text-sm max-w-xl', {
          'px-6 py-3': !compact,
          'px-4 py-2': compact,
        })}
        placeholder="Zoek een receptje"
        autoFocus
        tabIndex={1}
        autoComplete="off"
      />
      <button
        tabIndex={2}
        className={clsx(
          'bg-rose-500 hover:bg-rose-600 transition-colors text-white font-semibold text-sm rounded-full inline-block relative',
          {
            'px-6 py-3': !compact,
            'px-4 py-2': compact,
          },
        )}
        type="submit">
        <span
          className={clsx({
            'opacity-0': isLoading,
          })}>
          Zoek
        </span>
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
