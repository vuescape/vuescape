import { NotificationAction } from '@vuescape/store/Notification'

// tslint:disable:max-classes-per-file
export class StoreAction {
  public static readonly INITIALIZE_APP = 'initializeApp'
  public static readonly CLEAR_ENTIRE_STORE = 'clearEntireStore'
  public static readonly SPINNING = 'spinning'
}

export namespace StoreAction {
  export class NotificationActions extends NotificationAction {
  }
}
