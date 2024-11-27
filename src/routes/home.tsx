import i18next from 'i18next';
import { LoaderFunctionArgs, MetaFunction } from 'react-router';

import { Search } from '~/components/search';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    url: request.url,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: i18next.t('pages.home.title') },
    { name: 'description', content: i18next.t('pages.home.description') },
    { property: 'og:title', content: i18next.t('pages.home.title') },
    { property: 'og:description', content: i18next.t('pages.home.description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: new URL('/og.png', data?.url).toString() },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: i18next.t('pages.home.title') },
    { name: 'twitter:description', content: i18next.t('pages.home.description') },
    { name: 'twitter:image', content: new URL('/og.png', data?.url).toString() },
  ];
};

export default function Index() {
  return (
    <div className="flex sm:flex-1 sm:justify-center sm:items-center sm:pb-[33vh]">
      <Search />
    </div>
  );
}
