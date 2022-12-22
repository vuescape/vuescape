import Vue from 'vue'
import VueRouter, { NavigationGuard, RouteConfig } from 'vue-router'

export let router: VueRouter

export function makeRouter(routes?: Array<RouteConfig>,
  beforeResolveNavigationGuardFactories?: Array<(vueRouter: VueRouter) => NavigationGuard<Vue>>,
) {
  if (router && (!routes || routes.length === 0)) {
    return router
  }

  Vue.use(VueRouter)
  router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'app__router--is-active',
    scrollBehavior: () => ({
      y: 0,
      x: 0,
    }),
    routes,
  })

  if (beforeResolveNavigationGuardFactories) {
    for (const beforeResolveNavigationGuardFactory of beforeResolveNavigationGuardFactories) {
      router.beforeResolve(beforeResolveNavigationGuardFactory(router))
    }
  }

  return router
}
