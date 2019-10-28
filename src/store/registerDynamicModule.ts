import { Module, Store } from 'vuex'

export const registerDynamicModule = <S, R>(
  namespace: string,
  module: () => Module<S, R>,
  store: Store<R>,
  shouldUnregister = true,
) => {
  if (!(store && store.state && (store.state as any)[namespace])) {
    console.log(`registering module: ${namespace}`)
  } else {
    // tslint:disable-next-line: semicolon
    ;(store.state as any)[namespace] = null
    console.log(`reusing module: ${namespace}`)
    if (shouldUnregister) {
      store.unregisterModule(namespace)
    }
  }
  store.registerModule(namespace, module())
}
