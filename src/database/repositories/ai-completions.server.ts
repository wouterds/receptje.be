import crypto from 'node:crypto';

import { eq } from 'drizzle-orm';

import { AICompletion, AICompletionData, db } from '~/database';

const add = async (data: AICompletionData) => {
  const id = crypto.randomUUID();

  await db.insert(AICompletion).values({ ...data, id });

  return id;
};

const update = async (id: string, data: Partial<AICompletionData>) => {
  await db.update(AICompletion).set(data).where(eq(AICompletion.id, id));
};

export const AICompletions = {
  add,
  update,
};
