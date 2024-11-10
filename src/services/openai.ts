import OpenAILib from 'openai';

const openai = new OpenAILib({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAI {
  static async searchRecipe(prompt: string): Promise<Recipe> {
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
            "identifier": "basic-english-recipe-slug",
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
      throw new Error('No content returned from OpenAI');
    }

    return JSON.parse(completion.choices[0].message.content as string) as Recipe;
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
