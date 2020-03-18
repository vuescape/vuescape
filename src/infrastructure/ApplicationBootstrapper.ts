// tslint:disable: member-ordering
import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'

import defaultIconFont from './IconLoader'

import { Axios, CacheOptions } from '@vuescape/http'
import { setStore } from '@vuescape/store'
import { ModuleState, StoreModule } from '@vuescape/store/modules/types'
import { RootState } from '@vuescape/store/RootState'
import { Dictionary } from '@vuescape/types'

import 'element-theme-chalk/lib/loading.css'
import 'vue-resize/dist/vue-resize.css'
import { ErrorHandler } from 'vue-router/types/router'

import { VuetifyTheme } from 'vuetify'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

export class ApplicationBootstrapper {
  private iconfont: string
  private iconLoaders: Array<() => void>
  private vuetifyTheme = {}
  private errorHandler: ErrorHandler
  private storeModules = {}
  private vuexStore: Store<any>
  private router: VueRouter
  private rootComponentOptions: { el: string; componentName: string; rootComponent: VueConstructor<Vue>; props: any }
  private initFunction = async () => {
    return
  }
  private cacheOptions: CacheOptions

  private validate() {
    if (!this.router) {
      console.warn(
        'Router not set in ApplicationBootstrapper. ' + 'Call withRouter() with the router if a router is needed.',
      )
    }
    if (!this.vuexStore) {
      console.warn(
        'Vuex store not defined so storeModules could not registered.  Call withVuexStore() to set the Vuex Store.',
      )
    }
    if (!this.rootComponentOptions) {
      console.warn('No Vue root component defined.  Call withRootComponent() to set the root component.')
    }
  }

  private registerStoreModules = async (
    vuexStore: Store<any>,
    storeModulesToRegister: Dictionary<() => StoreModule<{}, ModuleState<{}, {}>, {}, {}>>,
  ) => {
    const { registerDynamicModule } = await import('@vuescape/store/registerDynamicModule')
    for (const key of Object.keys(storeModulesToRegister)) {
      console.log(key)
      registerDynamicModule(key, storeModulesToRegister[key], vuexStore)
    }
  }

  private defaultErrorHandler = (err: Error, vm: Vue, info: string) => {
    console.error(
      `Vue threw an error.
  Usually this is caused by an error during rendering but could be at any point during the component lifecycle.`,
    )
    console.error(err, vm, info)
  }

  public withRequestCaching(
    maxAgeMinutes = 15,
    maxSize = 100,
    shouldCacheAllGetRequests = true,
    cacheFlag = 'shouldCache',
  ) {
    this.cacheOptions = { maxAgeMinutes, maxSize, shouldCacheAllRequests: shouldCacheAllGetRequests, cacheFlag }
    return this
  }

  public withInit(initFunction: () => Promise<void>) {
    this.initFunction = initFunction
    return this
  }

  public withErrorHandler(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler
    return this
  }

  public withVuexStore(store: Store<any>) {
    this.vuexStore = store
    return this
  }

  public withStoreModules(storeModules: Dictionary<() => StoreModule<any, ModuleState<any, any>, RootState, any>>) {
    Object.assign(this.storeModules, storeModules)
    return this
  }

  public withIconfont(iconFont: string) {
    this.iconfont = iconFont
    return this
  }

  public withIconLoaders(...iconLoaders : Array<() => void>) {
    this.iconLoaders = iconLoaders
    return this
  }

  public withTheme(theme: Partial<VuetifyTheme>) {
    this.vuetifyTheme = theme
    return this
  }

  public withRouter(router: VueRouter) {
    this.router = router
    return this
  }

  public withRootComponent(el: string, componentName: string, rootComponent: VueConstructor<Vue>, props?: any) {
    this.rootComponentOptions = { el, componentName, rootComponent, props }
    return this
  }

  public async bootstrap() {
    this.validate()

    const VueResize: any = (await import('vue-resize')).default
    const ElLoading: any = (await import('element-loading')).default
    // const Vuetify = (await import('vuetify')).default

    Vue.use(VueResize)
    Vue.use(ElLoading)

    if (this.iconLoaders && this.iconLoaders.length) {
      this.iconLoaders.forEach(loadIcons => loadIcons())
    }
    const vuetifyOptions: any = { theme: this.vuetifyTheme }
    if (this.iconfont) {
      vuetifyOptions.iconfont = this.iconfont
    } else {
      vuetifyOptions.iconfont = defaultIconFont
    }
    Vue.use(Vuetify, vuetifyOptions)

    try {
      Vue.config.errorHandler = this.errorHandler || this.defaultErrorHandler

      setStore(this.vuexStore)

      if (this.cacheOptions) {
        await Axios.initCaching(this.cacheOptions)
      }

      await this.registerStoreModules(this.vuexStore, this.storeModules)

      const { sync } = await import('vuex-router-sync')
      sync(this.vuexStore, this.router)

      await this.initFunction()
      // tslint:disable-next-line:no-unused-expression
      new Vue({
        el: this.rootComponentOptions.el,
        store: this.vuexStore,
        router: this.router,
        template: `<${this.rootComponentOptions.componentName} />`,
        components: { [this.rootComponentOptions.componentName]: this.rootComponentOptions.rootComponent },
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
}
