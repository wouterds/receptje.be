import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';

import { Header } from '~/components/header';
import { useUser } from '~/hooks';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    url: request.url,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: 'Receptje' },
    { name: 'description', content: 'Vind je receptje in 1 2 3 op Receptje.be!' },
    // Open Graph tags
    { property: 'og:title', content: 'Receptje' },
    { property: 'og:description', content: 'Vind je receptje in 1 2 3 op Receptje.be!' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: new URL('/og.png', data?.url).toString() },
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Receptje' },
    { name: 'twitter:description', content: 'Vind je receptje in 1 2 3 op Receptje.be!' },
    { name: 'twitter:image', content: new URL('/og.png', data?.url).toString() },
  ];
};

export default function Index() {
  useUser();

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8 py-6">
      <Header />
    </div>
  );
}
