import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path     : '/:pathMatch(.*)*',
  name     : 'not-found',
  component: () => import(/* webpackChunkName: 'not-found' */
    '@vuescape/components/NotFound').then(m => m.default),
}
export default route
