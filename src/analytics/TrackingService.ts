import { RouteLocationNormalized } from 'vue-router'

import { TrackingProvider } from './TrackingProvider'

export interface TrackingService {
  initializeProvider(): void

  identifyUser(user: any): void

  handleRouteChanged(to: RouteLocationNormalized, from: RouteLocationNormalized): void

  getTrackingProvider(name?: string): TrackingProvider | undefined
}
