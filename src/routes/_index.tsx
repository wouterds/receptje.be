import type { MetaFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Receptje.be' },
    { name: 'description', content: 'Zoek makkelijk recepten op Receptje.be' },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
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
  );
}
