import { LoaderFunctionArgs, MetaFunction } from 'react-router';

import { Header } from '~/components/header';
import { SearchRecipe } from '~/components/search-recipe';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    url: request.url,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: 'Receptje' },
    { name: 'description', content: 'Vind je recept in 1 2 3 op Receptje.be!' },
    { property: 'og:title', content: 'Receptje' },
    { property: 'og:description', content: 'Vind je recept in 1 2 3 op Receptje.be!' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: new URL('/og.png', data?.url).toString() },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Receptje' },
    { name: 'twitter:description', content: 'Vind je recept in 1 2 3 op Receptje.be!' },
    { name: 'twitter:image', content: new URL('/og.png', data?.url).toString() },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 py-6 flex-1">
      <Header />
      <main className="px-6 sm:px-10 flex sm:flex-1 sm:justify-center sm:items-center sm:pb-[33vh]">
        <SearchRecipe />
      </main>
    </div>
  );
}
