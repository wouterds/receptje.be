import { eq } from 'drizzle-orm';

import { db, User, UserData } from '~/database';

const add = async (data: UserData) => {
  const [result] = await db.insert(User).values(data);
  const user = await db.query.User.findFirst({
    where: eq(User.id, result.insertId),
  });

  return user;
};

const get = async (id: number) => {
  return await db.query.User.findFirst({
    where: eq(User.id, id),
  });
};

export const Users = {
  add,
  get,
};
