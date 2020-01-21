import { AsyncAction, HttpAsyncAction } from '@vuescape/http'

import { ActionContext, ActionTree, GetterTree, Module, ModuleTree, MutationTree } from 'vuex'
import { AsyncResult, ModuleOptions, ModuleState, StoreModuleOptions, StoreModuleState, StoreOperation } from './'

import { NotificationOperation } from '@vuescape/store/Notification'

export class StoreModule<T, S extends ModuleState<T, P>, R, P = {}> implements Module<S, R> {
  public namespaced?: boolean
  public state?: S | (() => S)
  public getters?: GetterTree<S, R>
  public actions?: ActionTree<S, R>
  public mutations?: MutationTree<S>
  public modules?: ModuleTree<R>

  protected readonly moduleOptions: ModuleOptions<T, P>

  constructor(moduleOptions: ModuleOptions<T, P>) {
    this.namespaced = moduleOptions.isNamespaced
    this.moduleOptions = moduleOptions
    this.namespaced = true
    // TODO: as S is required to compile.  Is that correct?
    this.state = this.defaultState(moduleOptions.initialValue, moduleOptions.props) as S
    const notificationOperation = new NotificationOperation()
    this.actions = this.createActions()
    Object.assign(this.actions, notificationOperation.actions())
    this.mutations = this.createMutations()
    Object.assign(this.mutations, notificationOperation.mutations())
  }

  protected defaultState = (initialValue: T | undefined, props?: P): ModuleState<T, P> => {
    const moduleState: ModuleState<T, P> = new StoreModuleState<T, P>(
      false,
      false,
      true,
      false,
      { status: 0 },
      [],
      initialValue,
      props,
    )
    return moduleState
  }

  protected addActions(actions: ActionTree<S, R>) {
    if (this.actions) {
      Object.assign(this.actions, actions)
    } else {
      this.actions = actions
    }
  }

  protected addMutations(mutations: MutationTree<S>) {
    if (this.mutations) {
      Object.assign(this.mutations, mutations)
    } else {
      this.mutations = mutations
    }
  }

  protected addGetters(getters: GetterTree<S, R>) {
    if (this.getters) {
      Object.assign(this.getters, getters)
    } else {
      this.getters = getters
    }
  }

  protected executeAsyncAction = async (
    asyncAction: AsyncAction<T> | HttpAsyncAction<T>,
    payload: any,
    context: ActionContext<S, R>,
    moduleOptions: ModuleOptions<T, P>,
  ) => {
    // Instantiate StoreModuleOptions class to take advantage of default values
    const storeModuleOptions = new StoreModuleOptions({
      asyncActions: moduleOptions.asyncActions,
      isEmpty: moduleOptions.isEmpty,
      mapToValue: moduleOptions.mapToValue,
      initialValue: moduleOptions.initialValue,
      props: moduleOptions.props,
      spinnerDelay: moduleOptions.spinnerDelay,
      isNamespaced: moduleOptions.isNamespaced,
      shouldUseGlobalNotifications: moduleOptions.shouldUseGlobalNotifications,
      shouldUseGlobalSpinner: moduleOptions.shouldUseGlobalSpinner,
      errorHandlerBuilder: moduleOptions.errorHandlerBuilder,
    })
    context.commit(StoreOperation.Mutation.RESET)
    context.commit(StoreOperation.Mutation.PENDING, true)
    setTimeout(() => {
      if (context.state.isPending) {
        context.commit(StoreOperation.Mutation.SPINNING, true, {
          root: storeModuleOptions.shouldUseGlobalSpinner,
        })
      }
    }, storeModuleOptions.spinnerDelay)
    let result: any
    try {
      result = await asyncAction(payload)
      context.commit(StoreOperation.Mutation.SET_ASYNC_RESULT, {
        status: 200,
        statusText: 'OK',
      })
      // Axios response has the response in the data property.
      // If it exists then use it
      if (result.data !== undefined) {
        result = result.data
      }
    } catch (error) {
      const handleError = storeModuleOptions.errorHandlerBuilder!.build({
        context,
        shouldUseGlobalNotifications: moduleOptions.shouldUseGlobalNotifications,
      })
      handleError(error)

      if (storeModuleOptions.shouldUseGlobalSpinner) {
        context.commit(StoreOperation.Mutation.SPINNING, false, {
          root: storeModuleOptions.shouldUseGlobalSpinner,
        })
      }
    }
    if (storeModuleOptions && storeModuleOptions.isEmpty && storeModuleOptions.isEmpty(result)) {
      context.commit(StoreOperation.Mutation.SET_EMPTY)
    } else {
      result = storeModuleOptions && storeModuleOptions.mapToValue ? storeModuleOptions.mapToValue(result) : result
      context.commit(StoreOperation.Mutation.SET_VALUE, result)
    }

    if (storeModuleOptions.shouldUseGlobalSpinner) {
      context.commit(StoreOperation.Mutation.SPINNING, false, { root: storeModuleOptions.shouldUseGlobalSpinner })
    }
  }

  protected createActions: () => ActionTree<S, R> = () => {
    const moduleOptions = this.moduleOptions
    const storeModule = this
    const myActions: ActionTree<S, R> = {}
    if (moduleOptions.asyncActions) {
      Object.keys(moduleOptions.asyncActions).map(endpoint => {
        // Quiet complaining about object being possibly undefined
        if (moduleOptions.asyncActions) {
          const asyncAction = moduleOptions.asyncActions[endpoint]
          myActions[endpoint] = async (context, payload) => {
            await storeModule.executeAsyncAction(asyncAction, payload, context, moduleOptions)
          }
        }
      })
    }
    return myActions
  }

  protected createMutations: () => MutationTree<S> = () => {
    const moduleOptions = this.moduleOptions
    const getDefaultState = () => this.defaultState(moduleOptions.initialValue)
    const endPending = (state: S) => {
      state.isPending = false
      state.isSpinning = false
    }

    return {
      [StoreOperation.Mutation.RESET](state) {
        const defaultState = getDefaultState()
        state = Object.assign(state, defaultState)
      },
      [StoreOperation.Mutation.PENDING](state, payload: boolean) {
        state.isPending = payload
      },
      [StoreOperation.Mutation.SPINNING](state, payload: boolean) {
        state.isSpinning = payload
      },
      [StoreOperation.Mutation.SET_EMPTY](state) {
        endPending(state)
        state.isEmpty = true
        state.hasValue = false
        state.value = undefined
      },
      [StoreOperation.Mutation.SET_ASYNC_RESULT](state, payload: AsyncResult) {
        endPending(state)
        state.isEmpty = false
        state.hasValue = false
        state.value = undefined
        state.asyncResult = payload
      },
      [StoreOperation.Mutation.SET_VALUE](state, payload: T) {
        endPending(state)
        state.isEmpty = false
        state.hasValue = true
        state.value = payload
      },
    }
  }
}
