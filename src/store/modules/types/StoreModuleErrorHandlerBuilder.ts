import { ActionContext } from 'vuex'

import { makeRouter } from '@vuescape/infrastructure/router'
import { ErrorHandler, ErrorHandlerBuilder } from '@vuescape/store/modules/types/'
import { Guid } from '@vuescape/types'

import { NotificationMessage, NotificationType, StoreOperation } from '.'
import { AuthenticationModuleName, AuthenticationOperation } from '../Authentication'

export class StoreModuleErrorHandlerBuilder<S, R> implements ErrorHandlerBuilder {
  private context: ActionContext<S, R>
  private shouldUseGlobalNotifications = false

  public build(config: any): ErrorHandler {
    if (!config.context) {
      throw new Error('Expected config object to have a context property of type ActionContext')
    }

    if (config.shouldUseGlobalNotifications) {
      this.shouldUseGlobalNotifications = config.shouldUseGlobalNotifications
    }

    this.context = config.context
    return this.handleError
  }

  private handleError = async (error: any) => {
    if (error.response && error.response.status) {
      const status = error.response.status
      this.context.commit(StoreOperation.Mutation.SET_ASYNC_RESULT, {
        status,
        statusText: error.response.statusText,
        data: error.response.data,
      })
      if (status === 401) {
        // Global Action and redirect after it completes
        await this.context.dispatch(`${AuthenticationModuleName}/${AuthenticationOperation.Action.SIGN_OUT}`, null, {
          root: true,
        })
        // TODO: how to avoid store module having dependency on router
        // Use vuex (rootstate) to contain reactive URL to navigate to?
        return makeRouter().push('/sign-in')
      } else if (status === 400) {
        const errorMessage: NotificationMessage = {
          key: Guid.newGuid(),
          type: NotificationType.Error,
          message: error.response.data.message,
        }
        this.context.commit(StoreOperation.Mutation.NotificationMutations.ADD, errorMessage, {
          root: this.shouldUseGlobalNotifications,
        })
      } else {
        const errorMessage: NotificationMessage = {
          key: Guid.newGuid(),
          type: NotificationType.Error,
          message: error.response.data,
        }
        this.context.commit(StoreOperation.Mutation.NotificationMutations.ADD, errorMessage, {
          root: this.shouldUseGlobalNotifications,
        })
      }
    } else {
      const errorMessage: NotificationMessage = {
        key: Guid.newGuid(),
        type: NotificationType.Error,
        message: error.message,
      }
      this.context.commit(StoreOperation.Mutation.NotificationMutations.ADD, errorMessage, {
        root: this.shouldUseGlobalNotifications,
      })
      this.context.commit(StoreOperation.Mutation.SET_ASYNC_RESULT, {
        status: 523,
        statusText: error.message,
      })
    }
  }
}
