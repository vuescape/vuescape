import { ActionTree, MutationTree } from 'vuex'

import { NotificationMessage } from '@vuescape/store/modules/types'

import { NotificationAction } from './NotificationAction'
import { NotificationMutation } from './NotificationMutation'

export class NotificationOperation<S, R> {
  public state = () => {
    return {
      notifications: [] as Array<NotificationMessage>,
    }
  }

  public mutations: () => MutationTree<S> = () => {
    return {
      [NotificationMutation.ADD](currentState: any, notification: NotificationMessage) {
        const notifications = currentState.notifications as Array<NotificationMessage>
        // Do not display the same message twice.  A notification is considered a duplicate when it
        // has the same key or when it has the same type and message as an existing notification.
        const isDuplicate   = notifications.some(
          n => n.key === notification.key || (n.type === notification.type && n.message === notification.message))
        if (isDuplicate) {
          return
        }
        notifications.push(notification)
      },
      [NotificationMutation.REMOVE](currentState: any, key: string) {
        const index = (currentState.notifications as Array<NotificationMessage>).findIndex(n => n.key === key)
        if (index === -1) {
          return
        }
        currentState.notifications.splice(index, 1)
      },
      [NotificationMutation.CLEAR](currentState) {
        const state         = currentState as any
        state.notifications = []
      },
    }
  }
  public actions: () => ActionTree<S, R>  = () => {
    return {
      async [NotificationAction.ADD](context, notification: NotificationMessage) {
        context.commit(NotificationMutation.ADD, notification)
      },
      async [NotificationAction.REMOVE](context, key: string) {
        context.commit(NotificationMutation.REMOVE, key)
      },
      async [NotificationAction.CLEAR](context) {
        context.commit(NotificationMutation.CLEAR)
      },
    }
  }
}
