import Vue from 'vue'
import Component from 'vue-class-component'

import { Dictionary } from '@vuescape/types'

import { AsyncAction, HttpAsyncAction, HttpMethod, RestPayloadStrategy } from '@vuescape/http'
import { IsEmptyFunction, ValueMapper } from '@vuescape/store/modules/types'
import {
  registerStoreModule,
  registerStoreModuleIfNotExists,
  registerStoreModuleWithAsyncActions,
  registerStoreModuleWithAsyncActionsIfNotExists,
  registerStoreModuleWithInitialValue,
  registerStoreModuleWithInitialValueIfNotExists,
} from '@vuescape/store/storeHelpers'

@Component
export default class ComponentBase extends Vue {
  // TODO: expose all StoreModuleOptions e.g. actions?
  protected registerStoreModuleWithInitialValue<S>(namespace: string, initialValue: S) {
    registerStoreModuleWithInitialValue(this.$store, namespace, initialValue)
  }

  protected registerStoreModuleWithInitialValueIfNotExists<S>(namespace: string, initialValue: S) {
    registerStoreModuleWithInitialValueIfNotExists(this.$store, namespace, initialValue)
  }

  protected registerStoreModuleWithAsyncActionsIfNotExists<S, P = {}>(namespace: string,
    asyncActions: Dictionary<AsyncAction<S> | HttpAsyncAction<S>>,
    initialValue?: S,
    mapper?: ValueMapper<S>,
    isEmpty?: IsEmptyFunction<S>,
    props?: P,
    shouldUseGlobalNotifications = true,
  ) {
    registerStoreModuleWithAsyncActionsIfNotExists(this.$store,
      namespace,
      asyncActions,
      initialValue,
      mapper,
      isEmpty,
      props,
      shouldUseGlobalNotifications,
    )
  }

  protected registerStoreModuleWithAsyncActions<S, P = {}>(namespace: string,
    asyncActions: Dictionary<AsyncAction<S> | HttpAsyncAction<S>>,
    initialValue?: S,
    mapper?: ValueMapper<S>,
    isEmpty?: IsEmptyFunction<S>,
    props?: P,
    shouldUseGlobalNotifications = true,
  ) {
    registerStoreModuleWithAsyncActions(this.$store,
      namespace,
      asyncActions,
      initialValue,
      mapper,
      isEmpty,
      props,
      shouldUseGlobalNotifications,
    )
  }

  protected registerStoreModuleIfNotExists<S, P = {}>(namespace: string,
    httpMethod: HttpMethod,
    endpoint: string,
    baseUrl?: string,
    shouldUseCache      = true,
    initialValue?: S,
    mapper?: ValueMapper<S>,
    isEmpty?: IsEmptyFunction<S>,
    props?: P,
    restPayloadStrategy = RestPayloadStrategy.QueryString,
  ) {
    registerStoreModuleIfNotExists(this.$store,
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

  protected registerStoreModule<T, P = {}>(namespace: string,
    httpMethod: HttpMethod,
    endpoint: string,
    baseUrl?: string,
    shouldUseCache      = true,
    initialValue?: T,
    mapper?: ValueMapper<T>,
    isEmpty?: IsEmptyFunction<T>,
    props?: P,
    restPayloadStrategy = RestPayloadStrategy.QueryString,
    shouldDisableValueReactivity = true,
  ) {
    registerStoreModule(this.$store,
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
      shouldDisableValueReactivity,
    )
  }
}
