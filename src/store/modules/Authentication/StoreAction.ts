import { NotificationAction } from '@vuescape/store/Notification'

/**
 * Authentication actions that can be performed.
 */
// tslint:disable:max-classes-per-file
export class StoreAction {
  /**
   * Signs out.
   */
  public static readonly SIGN_OUT                 = 'signOut'

  /**
   * Signs in using username/password credentials.
   */
  public static readonly SIGN_IN_WITH_CREDENTIALS = 'signInWithCredentials'

  /**
   * Signs in using an issued auth token.
   */
  public static readonly SIGN_IN_WITH_TOKEN       = 'signInWithToken'

  /**
   * Handles the callback from the Auth provider.  e.g. sets a token or some other handling.
   */
  public static readonly HANDLE_AUTH_CALLBACK = 'handleAuthCallback'

  /**
   * Tries to sign in.  Used on app start to try to sign in if a persisted token exists.
   * e.g. cookie, local storage, etc.
   */
  public static readonly TRY_SIGN_IN = 'trySignIn'

  /**
   * Perform setup after being called back by an external auth provider.
   */
  public static readonly SETUP_FROM_PROVIDER      = 'setupFromProvider'
}

// Use namespace to simulate inner class on StoreAction to make NotificationActions easy to find
// Use this approach instead of extending class to avoid multiple inheritance constraint
export namespace StoreAction {
  export class NotificationActions extends NotificationAction {
  }
}
