import crypto from 'node:crypto';

import { eq } from 'drizzle-orm';

import { db, User, UserData } from '~/database';

const add = async (data: UserData) => {
  const id = crypto.randomUUID();

  await db.insert(User).values({ ...data, id });

  return db.query.User.findFirst({ where: eq(User.id, id) });
};

const get = async (id: string) => {
  const user = await db.query.User.findFirst({
    where: eq(User.id, id),
  });

  return user;
};

export const Users = {
  add,
  get,
};
