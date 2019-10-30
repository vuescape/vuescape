import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

export let store : Store<any>

export function setStore(vuexStore : Store<any>) {
  store = vuexStore
}
export { registerDynamicModule } from './registerDynamicModule'
export { RootState } from './RootState'
