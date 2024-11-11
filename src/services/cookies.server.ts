import { createCookie } from '@remix-run/node';

export const userId = createCookie('userId', {
  maxAge: 31536000,
});
