import { Module, Store } from 'vuex'

import { AsyncAction, HttpAsyncAction, HttpMethod, RestPayloadStrategy, RestService } from '@vuescape/http'
import {
  IsEmptyFunction, makeStoreModule, ModuleState, StoreModule, StoreModuleOptions, StoreOperation, ValueMapper,
} from '@vuescape/store/modules'
import { Dictionary } from '@vuescape/types'

export function makeStateKey(namespace: string, key: string) {
  let prefix = ''
  if (namespace) {
    prefix = `${namespace}/`
  }

  return prefix + key
}

export function getModuleStateByKey(stateKey: string, store: Store<any>): ModuleState<any> | undefined {
  if (store && store.state[stateKey]) {
    const moduleState = store.state[stateKey]
    return moduleState
  }
}

export function getModuleState(namespace: string, key: string, store: Store<any>): ModuleState<any> | undefined {
  const stateKey = makeStateKey(namespace, key)
  return getModuleStateByKey(stateKey, store)
}

export async function commitMutation(namespace: string, key: string, store: Store<any>, args?: any) {
  if (store) {
    const stateKey = makeStateKey(namespace, key)
    return store.commit(stateKey, args)
  }
}

export async function dispatchActionAsync(namespace: string, key: string, store: Store<any>, args?: any) {
  if (store) {
    const stateKey = makeStateKey(namespace, key)
    return store.dispatch(stateKey, args)
  }
}

export async function dispatchAndAwaitAction(namespace: string, key: string, store: Store<any>, args?: any) {
  if (store) {
    const stateKey = makeStateKey(namespace, key)
    await store.dispatch(stateKey, args)
  }
}

export const isModuleDefined = (namespace: string, store: Store<any>) => {
  const result = store && store.state && (store.state as any)[namespace]
  return result
}

export const registerDynamicModule = <S, R>(store: Store<R>,
  namespace: string,
  module: () => Module<S, R>,
  shouldUnregister = true,
) => {
  if (!(store && store.state && (store.state as any)[namespace])) {
    console.log(`registering module: ${namespace}`)
  }
  else {
    // tslint:disable-next-line: semicolon
    store.commit(makeStateKey(namespace, StoreOperation.Mutation.SET_VALUE), null)
    console.log(`reusing module: ${namespace}`)
    if (shouldUnregister) {
      store.unregisterModule(namespace)
    }
  }
  store.registerModule(namespace, module())
}

export function registerStoreModuleWithInitialValue<S, R>(store: Store<R>, namespace: string, initialValue: S) {
  const module = makeStoreModule(initialValue) as () => Module<S, R>
  registerDynamicModule<S, R>(store, namespace, module)
}

export function registerStoreModuleWithInitialValueIfNotExists<S, R>(store: Store<R>,
  namespace: string,
  initialValue: S,
) {
  if (!isModuleDefined(namespace, store)) {
    registerStoreModuleWithInitialValue(store, namespace, initialValue)
  }
}

export function registerStoreModuleWithAsyncActionsIfNotExists<S, R, P = {}>(store: Store<R>,
  namespace: string,
  asyncActions: Dictionary<AsyncAction<S> | HttpAsyncAction<S>>,
  initialValue?: S,
  mapper?: ValueMapper<S>,
  isEmpty?: IsEmptyFunction<S>,
  props?: P,
  shouldUseGlobalNotifications = true,
  shouldDisableValueReactivity = false,
) {
  if (!isModuleDefined(namespace, store)) {
    registerStoreModuleWithAsyncActions(store,
      namespace,
      asyncActions,
      initialValue,
      mapper,
      isEmpty,
      props,
      shouldUseGlobalNotifications,
      shouldDisableValueReactivity,
    )
  }
}

export function registerStoreModuleWithAsyncActions<S, R, P = {}>(store: Store<R>,
  namespace: string,
  asyncActions: Dictionary<AsyncAction<S> | HttpAsyncAction<S>>,
  initialValue?: S,
  mapper?: ValueMapper<S>,
  isEmpty?: IsEmptyFunction<S>,
  props?: P,
  shouldUseGlobalNotifications = true,
  shouldDisableValueReactivity = false,
) {
  const moduleOptions = new StoreModuleOptions<S, P>({
    asyncActions,
    isEmpty,
    mapToValue            : mapper,
    initialValue,
    props,
    spinnerDelay          : 300,
    shouldUseGlobalNotifications,
    shouldUseGlobalSpinner: true,
    shouldDisableValueReactivity,
  })
  const module        = () => new StoreModule<S, ModuleState<S>, R>(moduleOptions)
  registerDynamicModule(store, namespace, module)
}

export function registerStoreModuleIfNotExists<S, R, P = {}>(store: Store<R>,
  namespace: string,
  httpMethod: HttpMethod,
  endpoint: string,
  baseUrl?: string,
  shouldUseCache               = true,
  initialValue?: S,
  mapper?: ValueMapper<S>,
  isEmpty?: IsEmptyFunction<S>,
  props?: P,
  restPayloadStrategy          = RestPayloadStrategy.QueryString,
  shouldDisableValueReactivity = false,
) {
  if (!isModuleDefined(namespace, store)) {
    registerStoreModule(store,
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

export function registerStoreModule<S, R, P = {}>(store: Store<R>,
  namespace: string,
  httpMethod: HttpMethod,
  endpoint: string,
  baseUrl?: string,
  shouldUseCache  = true,
  initialValue?: S,
  mapper?: ValueMapper<S>,
  isEmpty?: IsEmptyFunction<S>,
  props?: P,
  restPayloadStrategy          = RestPayloadStrategy.QueryString,
  shouldDisableValueReactivity = false,
) {
  const restService = new RestService<S>(endpoint, baseUrl, shouldUseCache, undefined, restPayloadStrategy)

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
  registerStoreModuleWithAsyncActions(store,
    namespace,
    asyncActions,
    initialValue as any,
    mapper,
    isEmpty,
    props,
    true,
    shouldDisableValueReactivity,
  )
}
