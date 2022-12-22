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
        currentState.notifications.push(notification)
      },
      [NotificationMutation.REMOVE](currentState: any, key: string) {
        const index = (currentState.notifications as Array<NotificationMessage>).findIndex(n => n.key === key)
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
