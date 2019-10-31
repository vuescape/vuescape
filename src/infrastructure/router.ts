import Vue from 'vue'
import VueRouter, { NavigationGuard, RouteConfig } from 'vue-router'

export let router: VueRouter

// TODO: type beforeEach as NavigationGuard<Vue> => void
export function makeRouter(routes?: Array<RouteConfig>, navigationGuard? : NavigationGuard<Vue>) {
  if (router && (!routes || routes.length === 0)) {
    return router
  }

  Vue.use(VueRouter)
  router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'is-active',
    scrollBehavior: () => ({ y: 0, x: 0 }),
    routes,
  })

  if (navigationGuard) {
    router.beforeEach(navigationGuard)
  }

  return router
}
