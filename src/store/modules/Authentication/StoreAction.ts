import { NotificationAction } from '@vuescape/store/Notification'

// tslint:disable:max-classes-per-file
export class StoreAction {
  public static readonly SIGN_OUT = 'signOut'
  public static readonly SIGN_IN_WITH_CREDENTIALS = 'signInWithCredentials'
  public static readonly SIGN_IN_WITH_TOKEN = 'signInWithToken'
  public static readonly TRY_RESIGN_IN = 'tryReSignIn'
  public static readonly SETUP_FROM_PROVIDER = 'setupFromProvider'
}

// Use namespace to simulate inner class on StoreAction to make NotificationActions easy to find
// Use this approach instead of extending class to avoid multiple inheritance constraint
export namespace StoreAction {
  export class NotificationActions extends NotificationAction {
  }
}
