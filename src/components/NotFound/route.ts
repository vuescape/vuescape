import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  path: '*',
  name: 'not-found',
  meta: { requiresAuth: false },
  component: () =>
    import(/* webpackChunkName: 'not-found' */
    '@vuescape/components/NotFound').then(m => m.default),
}
export default route
