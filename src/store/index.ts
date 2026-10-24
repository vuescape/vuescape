import { Store } from 'vuex'

export let store: Store<any>

export function setStore(vuexStore: Store<any>) {
  store = vuexStore
}

export {
  dispatchActionAsync,
  dispatchAndAwaitAction,
  getModuleState,
  getModuleStateByKey,
  isModuleDefined,
  makeStateKey,
  registerDynamicModule,
} from './storeHelpers'
export { type RootState } from './RootState'
