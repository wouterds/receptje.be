import { eq } from 'drizzle-orm';

import { db, Recipe, RecipeData } from '~/database';

const add = async (data: RecipeData) => {
  const [result] = await db.insert(Recipe).values(data);
  const recipe = await db.query.Recipe.findFirst({ where: eq(Recipe.id, result.insertId) });

  return recipe;
};

const get = async (id: number) => {
  const recipe = await db.query.Recipe.findFirst({ where: eq(Recipe.id, id) });

  return recipe;
};

const getByUserId = async (userId: number) => {
  const recipes = await db.query.Recipe.findMany({
    where: eq(Recipe.userId, userId),
  });

  return recipes;
};

export const Recipes = {
  add,
  get,
  getByUserId,
};
