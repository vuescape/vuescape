import { NotificationMessage } from '@vuescape/store/modules/types'

export interface RootState {
  isAuthenticated: boolean
  notifications: Array<NotificationMessage>
  isSpinning: boolean
}
