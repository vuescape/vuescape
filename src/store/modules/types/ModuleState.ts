import { AsyncResult } from './AsyncResult'
import { NotificationMessage } from './NotificationMessage'

export interface ModuleState<T, Props = {}> {
  // Whether an async request is in call and the result is pending
  isPending: boolean
  // Whether to show the spinner or not. This allows to delay the spinner from appearing before a timeout has expired.
  // e.g. Afer 1 second of an async call show spinner
  isSpinning: boolean
  // Whether the result is empty. i.e. No Results Found.
  isEmpty: boolean
  // Whether the result has a value
  hasValue: boolean
  // The result of an async operation
  asyncResult: AsyncResult
  // List of notifications
  notifications: Array<NotificationMessage>
  props: Props | undefined
  // The value
  value: T | undefined
  abortController? : AbortController
}
