import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path     : '/site-maintenance',
  name     : '/site-maintenance',
  component: () => import(/* webpackChunkName: 'site-maintenance' */
    '@vuescape/components/SiteMaintenance').then(m => m.default),
}
export default route
