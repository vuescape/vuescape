// tslint:disable: member-ordering
import Vue, { CreateElement, VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { ErrorHandler } from 'vue-router/types/router'
import { Store } from 'vuex'

import { NullTrackingService, TrackingService } from '@vuescape/analytics'
import { Axios, CacheOptions } from '@vuescape/http'
import { setStore } from '@vuescape/store'
import { ModuleState, StoreModule } from '@vuescape/store/modules/types'
import { RootState } from '@vuescape/store/RootState'
import { Dictionary, FeatureService, InitFunctionResult, NullFeatureService } from '@vuescape/types'

import 'vue-resize/dist/vue-resize.css'

import { VuetifyTheme } from 'vuetify'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

export class ApplicationBootstrapper {
  private iconfont: string
  private iconLoaders: Array<() => void>
  private vuetifyTheme                     = {}
  private errorHandler: ErrorHandler
  private storeModules                     = {}
  private vuexStore: Store<any>
  private router: VueRouter
  private rootComponentOptions: { el: string; componentName: string; rootComponent: VueConstructor<Vue>; props: any }
  private trackingService: TrackingService = new NullTrackingService()
  private featureService: FeatureService   = new NullFeatureService()
  private globalClickHandler: (e: MouseEvent) => void

  private navigationComponent?: VueConstructor<Vue>
  private additionalAppComponents?: Array<VueConstructor<Vue>>

  private initFunction : () => Promise<InitFunctionResult> = async () => {
    return { redirectUrl: '' }
  }

  private cacheOptions: CacheOptions

  private validate() {
    if (!this.router) {
      console.warn('Router not set in ApplicationBootstrapper. ' + 'Call withRouter() with the router if a router is needed.')
    }
    if (!this.vuexStore) {
      console.warn(
        'Vuex store not defined so storeModules could not registered.  Call withVuexStore() to set the Vuex Store.')
    }
    if (!this.rootComponentOptions) {
      console.warn('No Vue root component defined.  Call withRootComponent() to set the root component.')
    }
  }

  private registerStoreModules = async (vuexStore: Store<any>,
    storeModulesToRegister: Dictionary<() => StoreModule<{}, ModuleState<{}, {}>, {}, {}>>,
  ) => {
    const { registerDynamicModule } = await import('@vuescape/store/storeHelpers')
    for (const key of Object.keys(storeModulesToRegister)) {
      console.log(key)
      registerDynamicModule(vuexStore, key, storeModulesToRegister[key])
    }
  }

  private defaultErrorHandler = (err: Error, vm: Vue, info: string) => {
    console.error(`Vue threw an error.
  Usually this is caused by an error during rendering but could be at any point during the component lifecycle.`)
    console.error(err, vm, info)
  }

  public withRequestCaching(maxAgeMinutes = 15,
    maxSize                               = 100,
    shouldCacheAllGetRequests             = true,
    cacheFlag                             = 'shouldCache',
  ) {
    this.cacheOptions = {
      maxAgeMinutes,
      maxSize,
      shouldCacheAllRequests: shouldCacheAllGetRequests,
      cacheFlag,
    }
    return this
  }

  public withInit(initFunction: () => Promise<InitFunctionResult>) {
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

  public withIconLoaders(...iconLoaders: Array<() => void>) {
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

  public withTrackingService(trackingService: TrackingService) {
    this.trackingService = trackingService
    return this
  }

  public withFeatureService(featureService: FeatureService) {
    this.featureService = featureService
    return this
  }

  public withNavigationComponent(navigationComponent: VueConstructor<Vue>) {
    this.navigationComponent = navigationComponent
    Vue.component(navigationComponent.name, navigationComponent)
    return this
  }

  public withAdditionalComponents(additionalAppComponents: Array<VueConstructor<Vue>>) {
    this.additionalAppComponents = additionalAppComponents
    for(const additionalAppComponent of additionalAppComponents) {
      Vue.component(additionalAppComponent.name, additionalAppComponent)
    }
    return this
  }

  public withRootComponent(el: string, componentName: string, rootComponent: VueConstructor<Vue>, props?: any) {
    this.rootComponentOptions = {
      el,
      componentName,
      rootComponent,
      props,
    }
    return this
  }

  public withGlobalClickHandler(handler: (e: MouseEvent) => void) {
    this.globalClickHandler = handler
    return this
  }

  public async bootstrap() {
    this.validate()

    const VueResize: any = (await import('vue-resize')).default

    Vue.use(VueResize)

    if (this.iconLoaders && this.iconLoaders.length) {
      this.iconLoaders.forEach(loadIcons => loadIcons())
    }
    const vuetifyOptions: any = { theme: this.vuetifyTheme }
    if (this.iconfont) {
      vuetifyOptions.iconfont = this.iconfont
    }
    else {
      vuetifyOptions.iconfont = 'fa'
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

      const result = await this.initFunction()
      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl
        return
      }

       // tslint:disable-next-line:no-unused-expression
      new Vue({
        provide   : () => ({
          trackingService    : this.trackingService,
          featureService     : this.featureService,
          navigationComponent: this.navigationComponent,
          globalClickHandler : this.globalClickHandler,
          additionalAppComponents: this.additionalAppComponents,
        }),
        el        : this.rootComponentOptions.el,
        store     : this.vuexStore,
        router    : this.router,
        render    : (h: CreateElement) => h(this.rootComponentOptions.rootComponent),
        components: { [this.rootComponentOptions.componentName]: this.rootComponentOptions.rootComponent },
      })
    }
    catch (error) {
      const err = error as any
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(err.response.data)
        console.error(err.response.status)
        console.error(err.response.headers)
      }
      else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(err.request)
      }
      else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', err.message)
      }
      console.error(err.config)
    }
  }
}
