import crypto from 'node:crypto';

import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { uuid } from '~/database/types/uuid.server';

export type User = InferSelectModel<typeof User>;
export type UserData = InferInsertModel<typeof User>;

export const User = mysqlTable(
  'users',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    firstName: varchar('first_name', { length: 64 }),
    lastName: varchar('last_name', { length: 64 }),
    email: varchar('email', { length: 128 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  }),
);
