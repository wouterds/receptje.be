import { createCookie } from 'react-router';

const userId = createCookie('userId', {
  maxAge: 31536000,
});

export const Cookies = {
  userId,
};
