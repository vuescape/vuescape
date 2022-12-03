import { NotificationMutation } from '@vuescape/store/Notification'

// tslint:disable:max-classes-per-file
export class StoreMutation {
  public static readonly HAS_EXTERNAL_SESSIONS_INITIALIZED = 'hasExternalSessionsInitialized'
  public static readonly IS_AUTHENTICATED = 'isAuthenticated'
  public static readonly CLEAR_ENTIRE_STORE = 'clearEntireStore'
  public static readonly SPINNING = 'SPINNING'
}

export namespace StoreMutation {
  export class NotificationAMutations extends NotificationMutation {
  }
}
