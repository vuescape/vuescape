import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'

import { ModuleState, StoreModule } from '@vuescape/store/modules/types'
import { Dictionary } from '@vuescape/types'

export interface AppOptions {
  router: VueRouter
  el: string
  componentName: string
  rootComponent: VueConstructor<Vue>
  store?: Store<any>
  storeModulesToRegister?: Dictionary<() => StoreModule<any, ModuleState<any, any>, any, any>>
  errorHandler?: (error: Error, vm: Vue, info: string) => void
}
