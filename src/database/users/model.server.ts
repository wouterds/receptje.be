import { InferInsertModel } from 'drizzle-orm';
import { index, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export type User = InferInsertModel<typeof User>;

export const User = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    fingerprint: varchar('fingerprint', { length: 32 }).notNull(),
    firstName: varchar('first_name', { length: 64 }).notNull(),
    lastName: varchar('last_name', { length: 64 }).notNull(),
    email: varchar('email', { length: 128 }).notNull(),
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
