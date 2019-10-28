import Vue from 'vue'
import VueRouter, { NavigationGuard, RouteConfig } from 'vue-router'

let routerInstance: VueRouter

// TODO: type beforeEach as NavigationGuard<Vue> => void
export function makeRouter(routes?: Array<RouteConfig>, navigationGuard? : NavigationGuard<Vue>) {
  if (routerInstance && (!routes || routes.length === 0)) {
    return routerInstance
  }

  Vue.use(VueRouter)
  routerInstance = new VueRouter({
    mode: 'history',
    linkActiveClass: 'is-active',
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes,
  })

  if (navigationGuard) {
    routerInstance.beforeEach(navigationGuard)
  }

  return routerInstance
}
