import crypto from 'node:crypto';

import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, int, json, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { uuid } from '~/database/types/uuid.server';

export type Recipe = InferSelectModel<typeof Recipe>;
export type RecipeData = InferInsertModel<typeof Recipe>;

export const Recipe = mysqlTable(
  'recipes',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: uuid('user_id').notNull(),
    identifier: varchar('identifier', { length: 128 }).notNull(),
    name: varchar('name', { length: 128 }).notNull(),
    portions: int('portions').notNull(),
    preparationTime: int('preparation_time').notNull(),
    ingredients: json('ingredients').notNull(),
    steps: json('steps').notNull(),
    keywords: json('keywords').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    identifierIdx: index('identifier_idx').on(table.identifier),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  }),
);
