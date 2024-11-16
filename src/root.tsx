import './tailwind.css';

import type { LinksFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import { captureRemixErrorBoundaryError, withSentry } from '@sentry/remix';
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
    <html lang="nl-BE">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/ico" href="/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="text-slate-500 text-sm py-6 px-6 sm:px-10 flex items-center gap-1.5">
          &copy; {new Date().getFullYear()} receptje.be, powered by gpt-4o-mini{' '}
          <SiOpenai className="text-base" />
        </footer>
        <ScrollRestoration />
        <Scripts />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="db631045-faaf-4fcf-a74b-4e979e9e4791"></script>
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  captureRemixErrorBoundaryError(error);

  let heading = 'Oeps, er is iets misgegaan';
  let message = 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.';

  if (isRouteErrorResponse(error)) {
    heading = `${error.status} ${error.statusText}`;
    message = error.data;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{heading}</h1>
      <p className="text-gray-600 text-center max-w-md">{message}</p>
    </div>
  );
};

export default withSentry(() => <Outlet />, { wrapWithErrorBoundary: false });
