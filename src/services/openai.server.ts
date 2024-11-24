import OpenAILib from 'openai';

import { AICompletions, Recipes } from '~/database';

const openai = new OpenAILib({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAI {
  static async searchRecipe(prompt: string, userId: string): Promise<Recipe | null> {
    if (prompt.length < 4) {
      console.error('Prompt is too short');
      return null;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Je bent een expert chef die recepten eenvoudig in het Nederlands (België), europese stijl, schrijft. Units dienen telkens voluit geschreven te worden, tenzij er geen unit is (laat dan deze leeg). Gebruik nooit "stukken" als unit, laat deze leeg in dat geval. Je reageert ALLEEN met recepten in JSON formaat. Als de vraag NIET over voedsel, ingrediënten of een echt recept gaat (bijvoorbeeld een naam, plaats, of willekeurig voorwerp), antwoord dan met null. Je mag nooit afwijken van het gevraagde JSON formaat of null als antwoord.',
        },
        {
          role: 'user',
          content: `Geef me een recept voor: ${prompt}. Geef alleen JSON terug (zonder backticks) in het volgende formaat:
          {
            "identifier": "simplified-dutch-slug",
            "keywords": ["keyword-in-dutch", "..."],
            "name": "Naam van het gerecht (zonder "gerecht" of "recept")",
            "description": "Korte & duidelijke beschrijving van het gerecht. Overdrijf niet met bijvoegelijke naamwoordenn, blijf bij de essentie. (120 - 160 characters).",
            "portions": "Aantal porties (getal)",
            "preparationTime": "Bereidingstijd in minuten (getal)",
            "ingredients": [
              { "amount": "...", "unit": "...", "description": "..." }
            ],
            "steps": [
              "Stap 1...",
              "Stap 2..."
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
