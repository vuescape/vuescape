import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { setStore } from '@vuescape/store'
import { AuthenticationModuleName, AuthenticationOperation } from '@vuescape/store/modules/Authentication'
import { RootStore } from '@vuescape/store/modules/Root'
import { ModuleState, StoreModule } from '@vuescape/store/modules/types'
import { RootState } from '@vuescape/store/RootState'
import { AppOptions, VuescapeConfiguration } from '@vuescape/types'
import { Dictionary } from '@vuescape/types'

import 'element-theme-chalk/lib/loading.css'
import 'material-design-icons-iconfont/dist/material-design-icons.scss'
import 'vue-resize/dist/vue-resize.css'
import 'vuetify/dist/vuetify.min.css'

export const DefaultVuetifyTheme = { primary: '#16a5c6' }

const registerStoreModules = async (
  vuexStore: Store<RootState>,
  storeModulesToRegister: Dictionary<() => StoreModule<{}, ModuleState<{}, {}>, RootState, {}>>,
) => {
  const { registerDynamicModule } = await import('@vuescape/store/registerDynamicModule')
  for (const key of Object.keys(storeModulesToRegister)) {
    console.log(key)
    registerDynamicModule(key, storeModulesToRegister[key], vuexStore)
  }
}

const useVueLibraries = async (vuexStore: Store<RootState>) => {
  const vuescapeConfiguration: ModuleState<VuescapeConfiguration> = (vuexStore.state as any).vuescapeConfiguration
  const theme =
    vuescapeConfiguration.value && vuescapeConfiguration.value.vuetifyTheme
      ? vuescapeConfiguration.value.vuetifyTheme
      : DefaultVuetifyTheme

  const VueResize: any = (await import('vue-resize')).default
  const ElLoading: any = (await import('element-loading')).default
  const Vuetify = (await import('vuetify')).default

  Vue.use(VueResize)
  Vue.use(ElLoading)
  Vue.use(Vuetify, { theme })
}

export async function applicationBootstrapper(options: AppOptions) {
  try {
    Vue.config.errorHandler = options.errorHandler || defaultErrorHandler

    const vuexStore: Store<any> = options.store || new Vuex.Store<any>(new RootStore())
    setStore(vuexStore)
    
    const storeModulesToRegister = options.storeModulesToRegister || {}
    
    await registerStoreModules(vuexStore, storeModulesToRegister)
    await useVueLibraries(vuexStore)

    const { sync } = await import('vuex-router-sync')
    sync(vuexStore, options.router)
  
    if ((vuexStore.state as any)[AuthenticationModuleName]) {
      await vuexStore.dispatch(`${AuthenticationModuleName}/${AuthenticationOperation.Action.TRY_RESIGN_IN}`)
    }

    // Vue.component(options.componentName, options.rootComponent)

    // tslint:disable-next-line:no-unused-expression
    new Vue({
      el: options.el,
      store: vuexStore,
      router: options.router,
      template: `<${options.componentName} />`,
      components: { [options.componentName]: options.rootComponent },
    })    
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data)
      console.error(error.response.status)
      console.error(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message)
    }
    console.error(error.config)
  }
}

const defaultErrorHandler = (err: Error, vm: Vue, info: string) => {
  // TODO: Display proper error?
  console.error(
    `Vue threw an error.
Usually this is caused by an error during rendering but could be at any point during the component lifecycle.`,
  )
  console.error(err, vm, info)
}
