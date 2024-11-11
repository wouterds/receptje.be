import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export type User = InferSelectModel<typeof User>;
export type UserData = InferInsertModel<typeof User>;
export type TransformedUser = Omit<User, 'id'> & {
  id: string;
};

export const User = mysqlTable(
  'users',
  {
    id: int('id').autoincrement().primaryKey(),
    fingerprint: varchar('fingerprint', { length: 32 }).notNull(),
    firstName: varchar('first_name', { length: 64 }),
    lastName: varchar('last_name', { length: 64 }),
    email: varchar('email', { length: 128 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => {
    return {
      fingerprintIdx: index('fingerprint_idx').on(table.fingerprint),
      emailIdx: index('email_idx').on(table.email),
      createdAtIdx: index('created_at_idx').on(table.createdAt),
    };
  },
);
