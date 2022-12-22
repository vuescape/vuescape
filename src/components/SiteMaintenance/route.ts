import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  path     : '/site-maintenance',
  name     : '/site-maintenance',
  component: () => import(/* webpackChunkName: 'site-maintenance' */
    '@vuescape/components/SiteMaintenance').then(m => m.default),
}
export default route
