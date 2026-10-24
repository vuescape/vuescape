import { RouteLocationNormalized } from 'vue-router'

// vue-router 3 passed every navigation param to a `props: true` route's component, including params that aren't
// in the route's path. vue-router 4 drops those, so navigation passes them as history state instead:
//   router.push({ name, params, state: { routeProps: { showNavigator: 'true' } } })
// and the route uses `props: routeProps` to give its component both.
export function routeProps(route: RouteLocationNormalized) {
  return { ...route.params, ...window.history.state?.routeProps }
}
