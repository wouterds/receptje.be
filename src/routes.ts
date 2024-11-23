import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes';

const routes: RouteConfig = [
  index('routes/home.tsx'),
  ...prefix('/recepten', [route('/:slug', 'routes/recipes/$slug.tsx')]),
  route('/mijn-recepten', 'routes/my-recipes/index.tsx'),

  // api only routes
  route('/me', 'routes/me.ts'),
  route('/users', 'routes/users.ts'),
  route('/search', 'routes/search.ts'),
  ...prefix('/recipes', [route('/:id', 'routes/recipes/$id.ts')]),
];

export default routes;
