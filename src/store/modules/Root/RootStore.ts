import { ActionTree, ModuleTree, MutationTree, Store, StoreOptions } from 'vuex'

import { NotificationOperation } from '@vuescape/store/Notification'
import { RootState } from '@vuescape/store/RootState'

import { StoreAction } from './StoreAction'
import { StoreMutation } from './StoreMutation'

const defaultState: RootState = {
  isAuthenticated: false,
  notifications: [],
  isSpinning: false,
}

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
  [StoreMutation.IS_AUTHENTICATED](currentState, isAuthenticated: boolean) {
    currentState.isAuthenticated = isAuthenticated
  },
  [StoreMutation.SPINNING](currentState, payload: boolean) {
    currentState.isSpinning = payload
  },
  [StoreMutation.CLEAR_ENTIRE_STORE](currentState) {
    Object.keys(currentState).forEach(property => {
      // TODO: handle config, auth and profile with a better approach instead of hard code here
      if (
        property === 'notifications' ||
        property === 'authentication' ||
        property === 'route' ||
        property === 'userProfile' ||
        property.endsWith('/configuration')
      ) {
        // no-op
      } else if (property === 'isAuthenticated') {
        currentState.isAuthenticated = false
      } else if (property === 'isSpinning') {
        currentState.isSpinning = false
      } else {
        // TODO: formalize this reset into a module state mutation
        // tslint:disable-next-line:semicolon
        ;(currentState as any)[property] = {}
        console.log(`Clear module state ${property}.`)
      }
    })
  },
}

Object.assign(mutations, notificationOperation.mutations())

export class RootStore extends Store<RootState> {
  private static readonly NullOptions: StoreOptions<RootState> = {}

  public modules: ModuleTree<RootState> = {}

  public actions: ActionTree<RootState, RootState> = actions

  public mutations: MutationTree<RootState> = mutations
  constructor() {
    super(RootStore.NullOptions)
    this.replaceState(defaultState)
  }
}
