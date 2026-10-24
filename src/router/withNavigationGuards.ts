import { NavigationGuard, NavigationGuardNext, NavigationGuardReturn, RouteLocationNormalized } from 'vue-router'

// Runs a guard to completion: until it calls next, or until it returns (or its promise resolves), whichever is first.
// Resolves to what the guard passed to next or returned; undefined means continue.
function runGuard(guard: NavigationGuard, to: RouteLocationNormalized, from: RouteLocationNormalized) {
  return new Promise<NavigationGuardReturn>((resolve, reject) => {
    let hasFinished = false
    const finish    = (value?: any) => {
      if (!hasFinished) {
        hasFinished = true
        resolve(value)
      }
    }

    try {
      Promise.resolve(guard.call(undefined, to, from, finish as NavigationGuardNext))
        .then(finish, reject)
    }
    catch (error) {
      reject(error)
    }
  })
}

// Runs guards in order, waiting for asynchronous ones, until one cancels or redirects the navigation.
// vue-router 4 allows calling next only once, so the guards can't each call it.
export function withNavigationGuards(...guards: Array<NavigationGuard>): NavigationGuard {
  if (!Array.isArray(guards)) {
    throw new Error(`guards must be an Array<NavigationGuard>. guards: ${guards}`)
  }

  return async (to, from, next) => {
    try {
      for (const guard of guards) {
        const result = await runGuard(guard, to, from)
        if (result !== undefined && result !== true) {
          next(result as any)
          return
        }
      }
      next()
    }
    catch (error) {
      next(error as Error)
    }
  }
}
