import { createCookie } from '@remix-run/node';

const userId = createCookie('userId', {
  maxAge: 31536000,
});

export const Cookies = {
  userId,
};
