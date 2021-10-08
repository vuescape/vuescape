import Vue from 'vue'
import Component from 'vue-class-component'
import { Dictionary } from 'vuex'

import { AsyncAction, HttpAsyncAction, HttpMethod, RestPayloadStrategy, RestService } from '@vuescape/http'
import {
  IsEmptyFunction,
  makeStoreModule,
  ModuleState,
  StoreModule,
  StoreModuleOptions,
  ValueMapper,
} from '@vuescape/store/modules/types'
import { isModuleDefined, registerDynamicModule } from '@vuescape/store/registerDynamicModule'
import { RootState } from '@vuescape/store/RootState'

@Component
export default class ComponentBase extends Vue {
  // TODO: expose all StoreModuleOptions e.g. actions?
  protected registerStoreModuleWithInitialValue<S>(namespace: string, initialValue: S) {
    const module = makeStoreModule(initialValue)
    registerDynamicModule(namespace, module, this.$store)
  }

  protected registerStoreModuleWithInitialValueIfNotExists<S>(namespace: string, initialValue: S) {
    if (!isModuleDefined(namespace, this.$store)) {
      this.registerStoreModuleWithInitialValue(namespace, initialValue)
    }
  }

  protected registerStoreModuleWithAsyncActionsIfNotExists<T, P = {}>(
    namespace: string,
    asyncActions: Dictionary<AsyncAction<T> | HttpAsyncAction<T>>,
    initialValue?: T,
    mapper?: ValueMapper<T>,
    isEmpty?: IsEmptyFunction<T>,
    props?: P,
    shouldUseGlobalNotifications = true,
  ) {
    if (!isModuleDefined(namespace, this.$store)) {
      this.registerStoreModuleWithAsyncActions(
        namespace,
        asyncActions,
        initialValue,
        mapper,
        isEmpty,
        props,
        shouldUseGlobalNotifications,
      )
    }
  }

  protected registerStoreModuleWithAsyncActions<T, P = {}>(
    namespace: string,
    asyncActions: Dictionary<AsyncAction<T> | HttpAsyncAction<T>>,
    initialValue?: T,
    mapper?: ValueMapper<T>,
    isEmpty?: IsEmptyFunction<T>,
    props?: P,
    shouldUseGlobalNotifications = true,
  ) {
    const moduleOptions = new StoreModuleOptions<T, P>({
      asyncActions,
      isEmpty,
      mapToValue: mapper,
      initialValue,
      props,
      spinnerDelay: 300,
      shouldUseGlobalNotifications,
      shouldUseGlobalSpinner: true,
    })
    const module = () => new StoreModule<T, ModuleState<T>, RootState>(moduleOptions)
    registerDynamicModule(namespace, module, this.$store)
  }

  protected registerStoreModuleIfNotExists<T, P = {}>(
    namespace: string,
    httpMethod: HttpMethod,
    endpoint: string,
    baseUrl?: string,
    shouldUseCache = true,
    initialValue?: T,
    mapper?: ValueMapper<T>,
    isEmpty?: IsEmptyFunction<T>,
    props?: P,
    restPayloadStrategy = RestPayloadStrategy.QueryString,
  ) {
    if (!isModuleDefined(namespace, this.$store)) {
      this.registerStoreModule(
        namespace,
        httpMethod,
        endpoint,
        baseUrl,
        shouldUseCache,
        initialValue,
        mapper,
        isEmpty,
        props,
        restPayloadStrategy,
      )
    }
  }

  protected registerStoreModule<T, P = {}>(
    namespace: string,
    httpMethod: HttpMethod,
    endpoint: string,
    baseUrl?: string,
    shouldUseCache = true,
    initialValue?: T,
    mapper?: ValueMapper<T>,
    isEmpty?: IsEmptyFunction<T>,
    props?: P,
    restPayloadStrategy = RestPayloadStrategy.QueryString,
  ) {
    const restService = new RestService<T>(endpoint, baseUrl, shouldUseCache, undefined, restPayloadStrategy)

    let service
    switch (httpMethod) {
      case HttpMethod.Get:
        service = restService.getAction
        break
      case HttpMethod.Post:
        service = restService.postAction
        break
      default:
        throw new Error('Unsupported HttpMethod: ' + httpMethod)
    }
    const asyncActions = { [endpoint]: service }
    this.registerStoreModuleWithAsyncActions(namespace, asyncActions, initialValue as any, mapper, isEmpty, props)
  }
}
