import { db } from '~/database/connection';

import { User } from './model.server';

const add = async (data: User) => {
  await db.insert(User).values(data);
};

export const Users = {
  add,
};
