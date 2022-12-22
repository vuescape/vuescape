import { NotificationMutation } from '@vuescape/store/Notification'

// tslint:disable:max-classes-per-file
export class StoreMutation {
  public static readonly SIGN_OUT = 'signOut'
  public static readonly SIGN_IN  = 'signIn'
}

export namespace StoreMutation {
  export class NotificationMutations extends NotificationMutation {
  }
}
