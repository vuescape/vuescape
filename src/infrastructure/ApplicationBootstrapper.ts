import { App, Component, ComponentPublicInstance, createApp, h } from 'vue'
import { Router } from 'vue-router'
import { Store } from 'vuex'

import { NullTrackingService, TrackingService } from '@vuescape/analytics'
import ResizeObserver from '@vuescape/components/ResizeObserver'
import { loading } from '@vuescape/directives/loading'
import { Axios, CacheOptions } from '@vuescape/http'
import { setApp } from '@vuescape/infrastructure/appContext'
import { registerGlobalComponent, setGlobalComponentApp } from '@vuescape/infrastructure/globalComponents'
import { setStore } from '@vuescape/store'
import { ModuleState, StoreModule } from '@vuescape/store/modules/types'
import { RootState } from '@vuescape/store/RootState'
import { Dictionary, FeatureService, InitFunctionResult, NullFeatureService } from '@vuescape/types'

import { createVuetify, IconSet } from 'vuetify'
import { aliases as faAliases, fa } from 'vuetify/iconsets/fa'
import { aliases as fa4Aliases, fa as fa4 } from 'vuetify/iconsets/fa4'
import 'vuetify/styles'

type ErrorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => void

export type ThemeColors = Dictionary<string>

const iconSets: Dictionary<{ aliases: any, set: IconSet }> = {
  fa : { aliases: faAliases, set: fa },
  fa4: { aliases: fa4Aliases, set: fa4 },
}

export class ApplicationBootstrapper {
  private iconfont                         = 'fa'
  private iconLoaders: Array<() => void>
  private themeColors: ThemeColors         = {}
  private errorHandler: ErrorHandler
  private storeModules                     = {}
  private vuexStore: Store<any>
  private router: Router
  private rootComponentOptions: { el: string; componentName: string; rootComponent: Component; props: any }
  private trackingService: TrackingService = new NullTrackingService()
  private featureService: FeatureService   = new NullFeatureService()
  private globalClickHandler: (e: MouseEvent) => void

  private navigationComponent?: Component
  private additionalAppComponents?: Array<Component>

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

  private defaultErrorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
    console.error(`Vue threw an error.
  Usually this is caused by an error during rendering but could be at any point during the component lifecycle.`)
    console.error(err, instance, info)
  }

  private createVuetify() {
    const iconSet = iconSets[this.iconfont]
    if (!iconSet) {
      throw new Error(`Unsupported icon font '${this.iconfont}'. Supported icon fonts: ${Object.keys(iconSets).join(', ')}`)
    }

    return createVuetify({
      icons: {
        defaultSet: this.iconfont,
        aliases   : iconSet.aliases,
        sets      : { [this.iconfont]: iconSet.set },
      },
      theme: {
        // Vuetify 4 defaults to the system theme; the sites are designed for light only
        defaultTheme: 'light',
        themes      : {
          light: {
            dark  : false,
            colors: this.themeColors,
          },
        },
      },
    })
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

  public withTheme(themeColors: ThemeColors) {
    this.themeColors = themeColors
    return this
  }

  public withRouter(router: Router) {
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

  public withNavigationComponent(navigationComponent: Component) {
    this.navigationComponent = navigationComponent
    registerGlobalComponent(navigationComponent.name!, navigationComponent)
    return this
  }

  public withAdditionalComponents(additionalAppComponents: Array<Component>) {
    this.additionalAppComponents = additionalAppComponents
    for(const additionalAppComponent of additionalAppComponents) {
      registerGlobalComponent(additionalAppComponent.name!, additionalAppComponent)
    }
    return this
  }

  public withRootComponent(el: string, componentName: string, rootComponent: Component, props?: any) {
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

    if (this.iconLoaders && this.iconLoaders.length) {
      this.iconLoaders.forEach(loadIcons => loadIcons())
    }

    try {
      setStore(this.vuexStore)

      if (this.cacheOptions) {
        await Axios.initCaching(this.cacheOptions)
      }

      await this.registerStoreModules(this.vuexStore, this.storeModules)

      const result = await this.initFunction()
      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl
        return
      }

      const { rootComponent, props } = this.rootComponentOptions
      const app: App = createApp({ render: () => h(rootComponent, props) })

      app.config.errorHandler = this.errorHandler || this.defaultErrorHandler
      app.provide('trackingService', this.trackingService)
      app.provide('featureService', this.featureService)
      app.provide('navigationComponent', this.navigationComponent)
      app.provide('globalClickHandler', this.globalClickHandler)
      app.provide('additionalAppComponents', this.additionalAppComponents)

      app.use(this.vuexStore)
      app.use(this.router)
      app.use(this.createVuetify())
      app.directive('loading', loading)
      app.component('resize-observer', ResizeObserver)
      setGlobalComponentApp(app)
      setApp(app)

      app.mount(this.rootComponentOptions.el)
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
