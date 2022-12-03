import Vue from 'vue'
import { NavigationGuard, RawLocation, Route } from 'vue-router'

import { store } from '../store'

const authenticatedNavigationGuardImpl: any = (
  to: Route,
  from: Route,
  next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void,
  signInPath: string,
) => {
  const doesRouteRequireAuthentication = to.matched.some(record => record.meta.requiresAuth)
  const doesRouteRequireAuthorization = to.matched.some(record => record.meta.roles)
  const isAuthenticated = store.state.isAuthenticated

  if (doesRouteRequireAuthentication && !isAuthenticated) {
    console.warn('User is not authenticated.  Need to authenticate.')
    // Sign in route is not defined in this sample
    next({ path: signInPath, query: { redirect: to.fullPath } })
  }
  else if (
    doesRouteRequireAuthorization // && some other authorization checks
  ) {
    console.warn('User is not authorized.')
    next(false)
  }
  else {
    next()
  }
}

export const makeAuthenticatedNavigationGuard = (signInPath: string) => {
  const authenticatedNavigationGuard: NavigationGuard<Vue> = (to, from, next) => {
    authenticatedNavigationGuardImpl(to, from, next, signInPath)
  }
  return authenticatedNavigationGuard
}
