import { NavigationGuard } from 'vue-router'

export function withNavigationGuards(...guards: Array<NavigationGuard>): NavigationGuard {
  if (!Array.isArray(guards)) {
    throw new Error(`guards must be an Array<NavigationGuard>. guards: ${guards}`)
  }

  return (to, from, next) => {
    let hasCompleted = false

    const nextHook = (value: any) => {
      hasCompleted = value !== undefined
      if (hasCompleted) {
        next(value)
      }
    }

    for (const guard of guards) {
      guard(to, from, nextHook)
      if (hasCompleted) {
        return
      }
    }

    next()
  }
}
