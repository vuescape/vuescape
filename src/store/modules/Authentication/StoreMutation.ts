/* eslint-disable max-classes-per-file */
import { NotificationMutation } from '@vuescape/store/Notification'

export class StoreMutation {
  public static readonly SIGN_OUT = 'signOut'
  public static readonly SIGN_IN  = 'signIn'
}

export namespace StoreMutation {
  export class NotificationMutations extends NotificationMutation {
  }
}
