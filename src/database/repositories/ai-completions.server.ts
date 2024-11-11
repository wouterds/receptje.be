import { AICompletion, AICompletionData, db } from '~/database';

const add = async (data: AICompletionData) => {
  await db.insert(AICompletion).values(data);
};

export const AICompletions = {
  add,
};
