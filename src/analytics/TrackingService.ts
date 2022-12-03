import { Route } from 'vue-router'

import { TrackingProvider } from './TrackingProvider'

export interface TrackingService {
  initializeProvider(): void

  identifyUser(user: any): void

  handleRouteChanged(to: Route, from: Route): void

  getTrackingProvider(name?: string): TrackingProvider | undefined
}
