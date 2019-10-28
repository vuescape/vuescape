import { AsyncAction, HttpAsyncAction } from '@vuescape/http'
import { Dictionary } from '@vuescape/types'

import { ErrorHandlerBuilder } from './ErrorHandlerBuilder'
import { IsEmptyFunction } from './IsEmptyFunction'
import { ValueMapper } from './ValueMapper'

export interface ModuleOptions<T, P = {}> {
  isNamespaced: boolean
  // Absolute path (is that true?) to the endpoint
  asyncActions?: Dictionary<AsyncAction<T> | HttpAsyncAction<T>>
  // Optional Function for determining if the result is empty or not
  isEmpty?: IsEmptyFunction<T>
  // Function to map a response to a value
  mapToValue?: ValueMapper<T>
  initialValue?: T
  props?: P
  // The delay in milliseconds before displaying the spinner
  spinnerDelay?: number
  // Should we use the global spinner or let the local component handle this
  shouldUseGlobalSpinner?: boolean
  // Should notifications be placed in the global notifications property
  shouldUseGlobalNotifications?: boolean
  // ErrorHandler builder
  errorHandlerBuilder?: ErrorHandlerBuilder
}
