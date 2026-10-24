import type { App, Component } from 'vue'

// Vue 3 registers global components on the app, but components are registered as their modules load,
// which can be before the app exists, so queue those until it does.
let app: App | undefined
const pendingComponents = new Map<string, Component>()

export function registerGlobalComponent(name: string, component: Component) {
  if (!app) {
    pendingComponents.set(name, component)
    return
  }

  if (!app.component(name)) {
    app.component(name, component)
  }
}

export function setGlobalComponentApp(vueApp: App) {
  app = vueApp
  pendingComponents.forEach((component, name) => registerGlobalComponent(name, component))
  pendingComponents.clear()
}
