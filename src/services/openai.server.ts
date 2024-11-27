import i18next from 'i18next';
import OpenAILib from 'openai';

import { AICompletions, Recipes } from '~/database';

const openai = new OpenAILib({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAI {
  static async searchRecipe(prompt: string, userId: string): Promise<Recipe | null> {
    if (prompt.length < 4) {
      console.error('Prompt is too short');
      return null;
    }

    const language = i18next.language;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
- You are an expert chef who writes recipes in a simple European style in the following language (ISO 639-1 code): ${language}.
- Always use consistent units, write them in full & lowercase.
- If there is no unit, leave it empty.
- If the unit is the same as the ingredient, leave it empty.
- If the unit is pieces or items, leave it empty.
- You ONLY respond with recipes in JSON format.
- If the question is NOT about food, ingredients or a real recipe, respond with null.
- You must never deviate from the requested JSON format or null as a response.
- Exclude the word "recipe" & "dish" from the name & slug.
          `,
        },
        {
          role: 'user',
          content: `Give me a recipe for: ${prompt}. Return only JSON (without backticks) in the following format:
          {
            "identifier": "simplified-slug-in-${language}",
            "keywords": ["keyword-in-${language}", "..."],
            "name": "Name of the dish",
            "description": "Short & clear description of the dish. Avoid as much as possible adjectives, stick to the basics. (120 - 160 characters).",
            "portions": "Number of portions (number)",
            "preparationTime": "Preparation time in minutes (number)",
            "ingredients": [
              { "amount": "...", "unit": "...", "description": "..." }
            ],
            "steps": [
              "Step 1...",
              "Step 2..."
            ]
          }`,
        },
      ],
      temperature: 0.7,
    });

    if (!completion.choices[0].message.content) {
      console.error('No content returned from OpenAI');
      return null;
    }

    const aiCompletionId = await AICompletions.add({
      userId,
      prompt,
      response: JSON.stringify(completion),
    });

    const response = JSON.parse(completion.choices[0].message.content as string);

    if (!this.isValidRecipe(response)) {
      console.error('Invalid recipe format returned from OpenAI');
      if (process.env.NODE_ENV !== 'production') {
        console.error(response);
      }
      return null;
    }

    const keywords = response.keywords.map((value) => value.toLowerCase());
    const portions = Number(response.portions);
    const preparationTime = Number(response.preparationTime);
    const ingredients = response.ingredients.filter((ingredient) => !!ingredient.description);
    const steps = response.steps.filter((step) => !!step);

    const recipe = await Recipes.add({
      userId,
      identifier: response.identifier,
      name: response.name,
      description: response.description,
      portions,
      preparationTime,
      ingredients,
      keywords,
      steps,
    });

    await AICompletions.update(aiCompletionId, { recipeId: recipe!.id });

    return {
      ...response,
      keywords,
      portions,
      preparationTime,
      ingredients,
      steps,
      id: recipe!.id,
    };
  }

  private static isValidRecipe(value: unknown): value is Recipe {
    const recipe = value as Recipe;

    if (typeof recipe?.identifier !== 'string') {
      return false;
    }

    if (typeof recipe?.name !== 'string') {
      return false;
    }

    if (typeof recipe?.description !== 'string') {
      return false;
    }

    if (isNaN(recipe.portions)) {
      return false;
    }

    if (isNaN(recipe.preparationTime)) {
      return false;
    }

    if (!Array.isArray(recipe.ingredients)) {
      return false;
    }

    return true;
  }
}

interface Recipe {
  id: string;
  identifier: string;
  name: string;
  description: string;
  keywords: string[];
  portions: number;
  preparationTime: number;
  ingredients: {
    amount: string;
    unit: string;
    description: string;
  }[];
  steps: string[];
}
