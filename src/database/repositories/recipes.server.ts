import { eq } from 'drizzle-orm';
import Sqids from 'sqids';

import { db, Recipe, RecipeData } from '~/database';

const alphabet = 'UMg4RQkNOrDqxHpiYVfWzsZGAhewl3FCd6K7nPvTLoBJSaXm8cyb059jt2EIu1';

const sqids = new Sqids({ alphabet, minLength: 8 });

const transformRecipe = (recipe: Recipe | undefined | null) => {
  if (!recipe) {
    return null;
  }

  return {
    ...recipe,
    encodedId: sqids.encode([recipe.id]),
  };
};

const add = async (data: RecipeData) => {
  const [result] = await db.insert(Recipe).values(data);
  const recipe = await db.query.Recipe.findFirst({ where: eq(Recipe.id, result.insertId) });

  return transformRecipe(recipe);
};

const get = async (idOrEncodedId: string | number) => {
  const id = typeof idOrEncodedId === 'string' ? sqids.decode(idOrEncodedId)[0] : idOrEncodedId;
  const recipe = await db.query.Recipe.findFirst({ where: eq(Recipe.id, id) });

  return transformRecipe(recipe);
};

const getByUserId = async (userId: number) => {
  const recipes = await db.query.Recipe.findMany({
    where: eq(Recipe.userId, userId),
    orderBy: (recipes) => recipes.createdAt,
  });

  return recipes.map(transformRecipe);
};

const getByIdentifier = async (identifier: string) => {
  const recipe = await db.query.Recipe.findFirst({
    where: eq(Recipe.identifier, identifier),
  });

  return transformRecipe(recipe);
};

export const Recipes = {
  add,
  get,
  getByUserId,
  getByIdentifier,
};
