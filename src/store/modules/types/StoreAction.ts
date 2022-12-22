import { NotificationAction } from '@vuescape/store/Notification'

// tslint:disable:max-classes-per-file
export class StoreAction {
  public static readonly GET  = 'GET'
  public static readonly POST = 'POST'
}

// Use namespace to simulate inner class on StoreAction to make NotificationActions easy to find
export namespace StoreAction {
  export class NotificationActions extends NotificationAction {
  }
}
