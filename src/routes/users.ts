import { ActionFunctionArgs, json } from '@remix-run/node';

import { Users } from '~/database';

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();
  const fingerprint = data.fingerprint as string;
  if (fingerprint?.length !== 32) {
    throw json({ error: 'Bad request' }, { status: 400 });
  }

  const user = await Users.add({ fingerprint });

  return json({ user });
};
