import crypto from 'node:crypto';

import { eq } from 'drizzle-orm';

import { db, Recipe, RecipeData } from '~/database';

const add = async (data: RecipeData) => {
  const id = crypto.randomUUID();

  await db.insert(Recipe).values({ ...data, id });

  return db.query.Recipe.findFirst({ where: eq(Recipe.id, id) });
};

const get = async (id: string) => {
  return db.query.Recipe.findFirst({ where: eq(Recipe.id, id) });
};

const getByUserId = async (userId: string) => {
  return db.query.Recipe.findMany({
    where: eq(Recipe.userId, userId),
  });
};

export const Recipes = {
  add,
  get,
  getByUserId,
};
