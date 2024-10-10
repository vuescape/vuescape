import { NotificationMessage } from '@vuescape/store/modules/types'

export interface RootState {
  hasExternalSessionsInitialized: boolean
  isAuthenticated: boolean
  notifications: Array<NotificationMessage>
  isSpinning: boolean
  lastActivityTimestamp: number
}
