import { NotificationOperation } from '@vuescape/store/Notification'
import { RootState } from '@vuescape/store/RootState'
import { ActionTree, MutationTree, StoreOptions } from 'vuex'

import { StoreAction } from './StoreAction'
import { StoreMutation } from './StoreMutation'

const notificationOperation = new NotificationOperation()

const actions: ActionTree<RootState, RootState> = {
  [StoreAction.SPINNING](context, payload: boolean) {
    context.commit(StoreMutation.SPINNING, payload)
  },
  [StoreAction.CLEAR_ENTIRE_STORE](context) {
    context.commit(StoreMutation.CLEAR_ENTIRE_STORE)
  },
}

Object.assign(actions, notificationOperation.actions())

const mutations: MutationTree<RootState> = {
  [StoreMutation.HAS_EXTERNAL_SESSIONS_INITIALIZED](currentState, hasExternalSessionsInitialized: boolean) {
    currentState.hasExternalSessionsInitialized = hasExternalSessionsInitialized
  },
  [StoreMutation.IS_AUTHENTICATED](currentState, isAuthenticated: boolean) {
    currentState.isAuthenticated = isAuthenticated
  },
  [StoreMutation.SPINNING](currentState, payload: boolean) {
    currentState.isSpinning = payload
  },
  [StoreMutation.LAST_ACTIVITY_TIMESTAMP](currentState, payload: number) {
    currentState.lastActivityTimestamp = payload
  },
  [StoreMutation.CLEAR_ENTIRE_STORE](currentState) {
    Object.keys(currentState).forEach(property => {
      // TODO: handle config, auth and profile with a better approach instead of hard code here
      if (property === 'notifications' || property === 'authentication' || property === 'route' || property === 'userProfile' || property.endsWith(
        '/configuration')) {
        // no-op
      }
      else if (property === 'isAuthenticated') {
        currentState.isAuthenticated = false
      }
      else if (property === 'isSpinning') {
        currentState.isSpinning = false
      }
      else {
        // TODO: formalize this reset into a module state mutation
        // tslint:disable-next-line:semicolon
        ;(currentState as any)[property] = {}
        console.log(`Clear module state ${property}.`)
      }
    })
  },
}

Object.assign(mutations, notificationOperation.mutations())

export const rootStoreOptions: StoreOptions<RootState> = {
  actions,
  mutations,
  plugins: [],
  state  : {
    hasExternalSessionsInitialized: false,
    isAuthenticated               : false,
    notifications                 : [],
    isSpinning                    : false,
    lastActivityTimestamp                  : Date.now(),
  },
  strict : process.env.NODE_ENV === '1development',
}
