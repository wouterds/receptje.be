import * as Sentry from '@sentry/remix';

Sentry.init({
  dsn: 'https://a6b24186382873322c3509292f2b4725@o308818.ingest.us.sentry.io/4508278842130432',
  tracesSampleRate: 1,
  autoInstrumentRemix: true,
});
