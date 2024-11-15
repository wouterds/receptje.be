import crypto from 'node:crypto';

import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

import { uuid } from '~/database/types/uuid.server';

export type AICompletionData = InferInsertModel<typeof AICompletion>;
export type AICompletion = InferSelectModel<typeof AICompletion>;

export const AICompletion = mysqlTable(
  'ai-completions',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: uuid('user_id').notNull(),
    prompt: varchar('prompt', { length: 128 }).notNull(),
    response: text('response').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    promptIdx: index('prompt_idx').on(table.prompt),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  }),
);
