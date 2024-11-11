import './tailwind.css';

import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { withSentry } from '@sentry/remix';
import { SiOpenai } from 'react-icons/si';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="text-slate-400 text-sm p-6 sm:p-8 flex items-center gap-2 justify-end">
          Powered by gpt-4o-mini <SiOpenai className="text-base" />
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const App = withSentry(() => {
  return <Outlet />;
});

export default App;
