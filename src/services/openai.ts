import OpenAILib from 'openai';

const openai = new OpenAILib({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAI {
  static async searchRecipe(prompt: string): Promise<Recipe | null> {
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
            'Je bent een expert chef die recepten in het Nederlands (België) schrijft voor beginners. Geef recepten terug in een gestructureerd JSON formaat (europese stijl, schrijf de units telkens volledig, laat leeg als er geen unit is).',
        },
        {
          role: 'user',
          content: `Geef me een recept voor: ${prompt}. Geef alleen JSON terug (zonder backticks) in het volgende formaat:
          {
            "identifier": "simplified-dutch-recipe-slug",
            "name": "Naam van het gerecht",
            "portions": "Number of portions (number)",
            "preparationTime": "Preparation time in minutes (number)",
            "ingredients": [
              { "amount": "...", "unit": "...", "item": "..." }
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

    const response = JSON.parse(completion.choices[0].message.content as string);

    if (!this.isValidRecipe(response)) {
      console.error('Invalid recipe format returned from OpenAI');
      return null;
    }

    return response;
  }

  private static isValidRecipe(recipe: unknown): recipe is Recipe {
    const r = recipe as Recipe;
    return (
      typeof r === 'object' &&
      r !== null &&
      typeof r.identifier === 'string' &&
      typeof r.name === 'string' &&
      typeof r.portions === 'number' &&
      typeof r.preparationTime === 'number' &&
      Array.isArray(r.ingredients) &&
      r.ingredients.every(
        (i) =>
          typeof i.amount === 'string' && typeof i.unit === 'string' && typeof i.item === 'string',
      ) &&
      Array.isArray(r.steps) &&
      r.steps.every((s) => typeof s === 'string')
    );
  }
}

interface Recipe {
  identifier: string;
  name: string;
  portions: number;
  preparationTime: number;
  ingredients: {
    amount: string;
    unit: string;
    item: string;
  }[];
  steps: string[];
}
