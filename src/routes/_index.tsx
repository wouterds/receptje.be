import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

import { OpenAI } from '~/services/openai';

export const meta: MetaFunction = () => {
  return [
    { title: 'Receptje.be' },
    { name: 'description', content: 'Zoek makkelijk recepten op Receptje.be' },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const prompt = formData.get('prompt') as string;

  return { recipe: await OpenAI.searchRecipe(prompt) };
};

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex items-center justify-center">
        <Form
          method="post"
          className="rounded-xl p-12 shadow-lg bg-white text-sm flex items-center gap-4 max-w-xl w-full">
          <input
            type="text"
            name="prompt"
            className="border rounded-full px-6 py-3 flex-1"
            placeholder="Zoek een receptje"
          />
          <button
            className="bg-rose-500 hover:bg-rose-600 transition-colors text-white font-semibold px-6 py-3 rounded-full inline-block"
            type="submit">
            Zoek
          </button>
        </Form>
      </div>

      {data?.recipe && (
        <div className="max-w-2xl mx-auto -mt-32 mb-16">
          <div className="rounded-xl p-12 shadow-lg bg-white space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{data.recipe.name}</h1>

            <div className="flex gap-4 text-sm text-gray-600">
              <p>👥 {data.recipe.portions}</p>
              <p>⏱️ {data.recipe.preparationTime} minuten</p>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-3">Ingrediënten</h2>
              <ul className="space-y-2">
                {data.recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <span className="font-medium">
                      {ingredient.amount} {ingredient.unit}
                    </span>{' '}
                    {ingredient.item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-3">Bereiding</h2>
              <ol className="space-y-3">
                {data.recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="font-medium text-rose-500">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
