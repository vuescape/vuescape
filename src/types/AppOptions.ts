import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'

import { Dictionary } from '@vuescape/types'

import { ModuleState, StoreModule } from '@vuescape/store/modules/types'
import { RootState } from '@vuescape/store/RootState'

// TODO: should simple UI properties of appOptions be in app configuration?
export interface AppOptions {
  router: VueRouter
  el: string
  componentName: string
  rootComponent: VueConstructor<Vue>
  store?: Store<RootState>
  // TODO: define type to be actual vuex module () => Module
  storeModulesToRegister?: Dictionary<() => StoreModule<any, ModuleState<any, any>, RootState, any>>
  errorHandler?: (error: Error, vm: Vue, info: string) => void
}
