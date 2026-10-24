import { createRouter, createWebHistory, NavigationGuard, Router, RouteRecordRaw } from 'vue-router'

export let router: Router

export function makeRouter(routes?: Array<RouteRecordRaw>,
  beforeResolveNavigationGuardFactories?: Array<(vueRouter: Router) => NavigationGuard>,
) {
  if (router && (!routes || routes.length === 0)) {
    return router
  }

  router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'app__router--is-active',
    scrollBehavior: () => ({
      top: 0,
      left: 0,
    }),
    routes: routes ?? [],
  })

  if (beforeResolveNavigationGuardFactories) {
    for (const beforeResolveNavigationGuardFactory of beforeResolveNavigationGuardFactories) {
      router.beforeResolve(beforeResolveNavigationGuardFactory(router))
    }
  }

  return router
}
