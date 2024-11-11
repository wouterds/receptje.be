import process from 'node:process';

import { init as initSentry } from '@sentry/remix';

initSentry({
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.COMMIT_SHA,
  dsn: 'https://bcd02f0c0ced743f72aa56d0e0e9cf34@o308818.ingest.us.sentry.io/4508281727090688',
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});
