import { NotificationMutation } from '@vuescape/store/Notification'

// tslint:disable:max-classes-per-file
export class StoreMutation {
  public static readonly RESET = 'RESET'
  public static readonly PENDING = 'PENDING'
  public static readonly SPINNING = 'SPINNING'
  public static readonly SET_EMPTY = 'SET_EMPTY'
  public static readonly SET_ASYNC_RESULT = 'SET_ASYNC_RESULT'
  public static readonly SET_VALUE = 'SET_VALUE'
}

export namespace StoreMutation {
  export class NotificationMutations extends NotificationMutation {}
}
