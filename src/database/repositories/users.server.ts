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
    id: sqids.encode([user.id]),
  };
};

const add = async (data: UserData) => {
  const [result] = await db.insert(User).values(data);
  const user = await db.query.User.findFirst({
    where: eq(User.id, result.insertId),
  });

  return transformUser(user);
};

const get = async (id: string) => {
  const user = await db.query.User.findFirst({
    where: eq(User.id, sqids.decode(id)[0]),
  });

  return transformUser(user);
};

export const Users = {
  add,
  get,
};
