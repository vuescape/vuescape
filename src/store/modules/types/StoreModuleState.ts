import { AsyncResult, ModuleState, NotificationMessage } from './'

export class StoreModuleState<T, P = {}> implements ModuleState<T, P> {
  public readonly isPending: boolean
  public readonly isSpinning: boolean
  public readonly isEmpty: boolean
  public readonly hasValue: boolean
  public readonly asyncResult: AsyncResult
  public readonly notifications: Array<NotificationMessage>
  public readonly value: T | undefined
  public readonly props: P | undefined

  constructor(
    isPending: boolean,
    isSpinning: boolean,
    isEmpty: boolean,
    hasValue: boolean,
    asyncResult: AsyncResult,
    notifications: Array<NotificationMessage>,
    value?: T,
    props?: P,
  ) {
    this.isPending     = isPending
    this.isSpinning    = isSpinning
    this.isEmpty       = isEmpty
    this.hasValue      = hasValue
    this.asyncResult   = asyncResult
    this.notifications = notifications
    this.value         = value
    this.props         = props
  }
}
