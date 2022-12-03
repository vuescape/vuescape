import Vue from 'vue'
import { NavigationGuard, Route } from 'vue-router'

export const makeNavigationGuard = (
  isAuthorized: (to: Route, from: Route) => boolean,
  onNotAuthorized?: (to: Route, from: Route) => void,
  onAuthorized?: (to: Route, from: Route) => void,
) => {
  if (!isAuthorized) {
    throw new Error('isAuthorized must not be undefined, or null.')
  }

  const isAuthorizedNavigationGuard: NavigationGuard<Vue> = (to, from, next) => {
    if (isAuthorized(to, from)) {
      if (onAuthorized) {
        onAuthorized(to, from)
      }
      next()
    }
    else {
      if (onNotAuthorized) {
        onNotAuthorized(to, from)
      }
      next(false)
    }
  }

  return isAuthorizedNavigationGuard
}
