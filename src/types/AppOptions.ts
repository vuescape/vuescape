import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'

// TODO: should simple UI properties of appOptions be in app configuration?
export interface AppOptions {
  router: VueRouter
  el: string
  componentName: string
  rootComponent: VueConstructor<Vue>
  store?: Store<any>
  storeModulesToRegister?: Dictionary<() => StoreModule<any, ModuleState<any, any>, any, any>>
  errorHandler?: (error: Error, vm: Vue, info: string) => void
}
