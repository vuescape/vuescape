import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path     : '*',
  name     : 'not-found',
  component: () => import(/* webpackChunkName: 'not-found' */
    '@vuescape/components/NotFound').then(m => m.default),
}
export default route
