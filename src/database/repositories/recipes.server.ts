import crypto from 'node:crypto';

import { and, desc, eq, isNull } from 'drizzle-orm';

import { db, Recipe, RecipeData } from '~/database';

const add = async (data: RecipeData) => {
  const id = crypto.randomUUID();

  await db.insert(Recipe).values({ ...data, id });

  return db.query.Recipe.findFirst({ where: eq(Recipe.id, id) });
};

const getById = async (id?: string) => {
  if (!id) {
    return null;
  }

  const recipe = await db.query.Recipe.findFirst({
    where: and(eq(Recipe.id, id), isNull(Recipe.deletedAt)),
  });
  if (!recipe) {
    return null;
  }

  return transformRecipe(recipe);
};

const getByUserId = async (userId: string) => {
  const recipes = await db.query.Recipe.findMany({
    where: and(eq(Recipe.userId, userId?.toString()), isNull(Recipe.deletedAt)),
    orderBy: [desc(Recipe.createdAt)],
  });

  return recipes.map(transformRecipe);
};

const deleteById = async (id: string) => {
  await db.delete(Recipe).where(eq(Recipe.id, id));
};

const transformRecipe = (recipe: Recipe) => {
  return {
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients as string) as [Record<string, string>],
    steps: JSON.parse(recipe.steps as string) as string[],
    keywords: JSON.parse(recipe.keywords as string) as string[],
  };
};

export const Recipes = {
  add,
  getById,
  getByUserId,
  deleteById,
};
