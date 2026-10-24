import { App, inject } from 'vue'

let app: App | undefined

export function setApp(vueApp: App) {
  app = vueApp
}

// Gets a value the app provides from outside a component, e.g. in a navigation guard.
// Returns undefined until the app has been created.
export function injectFromApp<T>(key: string): T | undefined {
  return app?.runWithContext(() => inject<T | undefined>(key, undefined))
}
