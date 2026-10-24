import { Vue } from '@vuescape/decorators'
import { NavigationGuard, RouteLocationNormalized } from 'vue-router'

export const makeNavigationGuard = (
  isAuthorized: (to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean,
  onNotAuthorized?: (to: RouteLocationNormalized, from: RouteLocationNormalized) => void,
  onAuthorized?: (to: RouteLocationNormalized, from: RouteLocationNormalized) => void,
) => {
  if (!isAuthorized) {
    throw new Error('isAuthorized must not be undefined, or null.')
  }

  const isAuthorizedNavigationGuard: NavigationGuard = (to, from, next) => {
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
