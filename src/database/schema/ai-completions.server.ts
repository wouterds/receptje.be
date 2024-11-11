import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export type AICompletionData = InferInsertModel<typeof AICompletion>;
export type AICompletion = InferSelectModel<typeof AICompletion>;

export const AICompletion = mysqlTable(
  'ai-completions',
  {
    id: int('id').autoincrement().primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    prompt: varchar('prompt', { length: 64 }).notNull(),
    response: text('response').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
      promptIdx: index('prompt_idx').on(table.prompt),
      createdAtIdx: index('created_at_idx').on(table.createdAt),
    };
  },
);
