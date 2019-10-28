import { NotificationType } from './NotificationType'

export interface NotificationMessage {
  key: string
  type: NotificationType
  message: string
}
