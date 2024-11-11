import { db } from '~/database/connection';

import { AICompletion } from './model.server';

const add = async (data: AICompletion) => {
  await db.insert(AICompletion).values(data);
};

export const AICompletions = {
  add,
};
