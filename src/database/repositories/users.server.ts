import { eq } from 'drizzle-orm';
import Sqids from 'sqids';

import { db, User, UserData } from '~/database';

const alphabet = 'koPcy5IwDTumjbOUZ8Vq1dCXnNGfxzsvrFYKpli3RtE9Hg7S0ea6JM2WBAh4QL';

const sqids = new Sqids({ alphabet, minLength: 8 });

const transformUser = (user: User | undefined | null) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    encodedId: sqids.encode([user.id]),
  };
};

const add = async (data: UserData) => {
  const [result] = await db.insert(User).values(data);
  const user = await db.query.User.findFirst({ where: eq(User.id, result.insertId) });

  return transformUser(user);
};

const get = async (idOrEncodedId: string | number) => {
  const id = typeof idOrEncodedId === 'string' ? sqids.decode(idOrEncodedId)[0] : idOrEncodedId;
  const user = await db.query.User.findFirst({ where: eq(User.id, id) });

  return transformUser(user);
};

export const Users = {
  add,
  get,
};
