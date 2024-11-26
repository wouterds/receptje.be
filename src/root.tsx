import './main.css';

import { IconMoodWrrr } from '@tabler/icons-react';
import countries from 'i18n-iso-countries';
import i18next from 'i18next';
import { ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';
import {
  isRouteErrorResponse,
  Links,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import { Footer } from './components/footer';
import { Header } from './components/header';

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: await import('translations/en.json') },
    nl: { translation: await import('translations/nl.json') },
  },
  lng: 'nl',
  fallbackLng: 'en',
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = request.headers.get('Accept-Language')?.split('-')[0] || 'en';
  const countryCode = request.headers.get('CF-IPCountry')!;
  const country = {
    code: countryCode,
    name: countries.getName(countryCode, 'en', { select: 'alias' }),
  };

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  if (!['NL', 'BE'].includes(countryCode) && locale !== 'nl') {
    await i18next.changeLanguage('en');
  }

  return {
    locale,
    country,
  };
};

export const links: Route.LinksFunction = () => [
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

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
        <Header />
        <main className="flex flex-1 flex-col px-6 sm:px-10 text-black/80">{children}</main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="db631045-faaf-4fcf-a74b-4e979e9e4791"
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = '';
  let details = '';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  console.error(message, details, stack);

  return (
    <div className="max-w-lg m-12 mx-auto bg-white/50 border border-black/5 rounded-lg p-8">
      <h1 className="text-xl font-semibold mb-4 sm:mb-6 text-black/80">
        Oops something went wrong!
      </h1>
      <p className="text-black/60 text-center text-sm font-medium">
        {details && (
          <>
            {details}
            <br />
          </>
        )}
        <IconMoodWrrr className="opacity-50 text-center mx-auto mt-4" />
      </p>
    </div>
  );
}
