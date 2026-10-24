import { Component, ComponentPublicInstance } from 'vue'
import { Router } from 'vue-router'
import { Store } from 'vuex'

import { ModuleState, StoreModule } from '@vuescape/store/modules/types'
import { Dictionary } from '@vuescape/types'

export interface AppOptions {
  router: Router
  el: string
  componentName: string
  rootComponent: Component
  store?: Store<any>
  storeModulesToRegister?: Dictionary<() => StoreModule<any, ModuleState<any, any>, any, any>>
  errorHandler?: (error: unknown, instance: ComponentPublicInstance | null, info: string) => void
}
