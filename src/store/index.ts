import Vue from 'vue'
import Vuex from 'vuex'

import { RootStore } from '@vuescape/store/modules/Root'

Vue.use(Vuex)

export let store = new Vuex.Store(new RootStore())

export { registerDynamicModule } from './registerDynamicModule'
export { RootState } from './RootState'
