import crypto from 'node:crypto';

import { AICompletion, AICompletionData, db } from '~/database';

const add = async (data: AICompletionData) => {
  const id = crypto.randomUUID();

  await db.insert(AICompletion).values({ ...data, id });

  return id;
};

export const AICompletions = {
  add,
};
