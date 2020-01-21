import { AsyncAction, HttpAsyncAction } from '@vuescape/http'
import {
  ErrorHandlerBuilder,
  IsEmptyFunction,
  ModuleOptions,
  StoreModuleErrorHandlerBuilder,
  ValueMapper,
} from '@vuescape/store/modules/types'
import { Dictionary } from '@vuescape/types'

export class StoreModuleOptions<T, P = {}> implements ModuleOptions<T, P> {
  private static defaultIsEmpty<T>(value: T) {
    if (value !== null && value !== undefined && (value as any).length === 0) {
      return true
    } else if (Object.keys(value).length === 0 && (value as any).constructor === Object ) {
      // Empty object {} is also empty
      return true
    } else if (value) {
      return false
    } else if (((value as unknown) as number) === 0) {
      return false
    } else if (((value as unknown) as string) === '') {
      return false
    }
    return true
  }

  private static identityMapper<T>(value: any) {
    return value as T
  }

  public readonly isNamespaced: boolean
  // Absolute path (is that true?) to the endpoint
  public readonly asyncActions: Dictionary<AsyncAction<T> | HttpAsyncAction<T>> | undefined
  // Optional Function for determining if the result is empty or not
  public readonly isEmpty: IsEmptyFunction<T> | undefined
  // Function to map a response to a value
  public readonly mapToValue: ValueMapper<T> | undefined
  public readonly initialValue: T | undefined
  public readonly props: P | undefined
  // The delay in milliseconds before displaying the spinner
  public readonly spinnerDelay: number
  // Should we use the global spinner or let the local component handle this
  public readonly shouldUseGlobalSpinner: boolean | undefined
  // Should notifications be placed in the global notifications property
  public readonly shouldUseGlobalNotifications: boolean | undefined

  public readonly errorHandlerBuilder: ErrorHandlerBuilder | undefined

  constructor({
    asyncActions = {},
    isEmpty = StoreModuleOptions.defaultIsEmpty,
    mapToValue = StoreModuleOptions.identityMapper,
    initialValue,
    props,
    spinnerDelay = 300,
    isNamespaced = true,
    shouldUseGlobalNotifications = false,
    shouldUseGlobalSpinner = false,
    errorHandlerBuilder = new StoreModuleErrorHandlerBuilder(),
  }: {
    asyncActions?: Dictionary<AsyncAction<T> | HttpAsyncAction<T>>
    isEmpty?: IsEmptyFunction<T>
    mapToValue?: ValueMapper<T>
    initialValue?: T
    props?: P
    spinnerDelay?: number
    isNamespaced?: boolean
    shouldUseGlobalNotifications?: boolean
    shouldUseGlobalSpinner?: boolean
    errorHandlerBuilder?: ErrorHandlerBuilder,
  } = {}) {
    if (asyncActions !== undefined) {
      this.asyncActions = asyncActions
    }

    this.isEmpty = isEmpty ? isEmpty : StoreModuleOptions.defaultIsEmpty
    this.mapToValue = mapToValue ? mapToValue : StoreModuleOptions.identityMapper
    this.initialValue = initialValue
    this.isNamespaced = isNamespaced
    this.shouldUseGlobalNotifications = shouldUseGlobalNotifications
    this.shouldUseGlobalSpinner = shouldUseGlobalSpinner

    if (!Number.isInteger(spinnerDelay) || spinnerDelay < 0) {
      throw new TypeError('spinnerDelay must be a valid integer')
    }
    this.spinnerDelay = spinnerDelay

    this.errorHandlerBuilder = errorHandlerBuilder
  }
}
