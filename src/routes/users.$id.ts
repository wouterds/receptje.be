import { json, LoaderFunctionArgs } from '@remix-run/node';

import { Users } from '~/database';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id as string;
  if (!id) {
    throw json({ error: 'Bad request' }, { status: 400 });
  }

  const user = await Users.get(id);
  if (!user) {
    throw json({ error: 'Not found' }, { status: 404 });
  }

  return json({ user });
};
