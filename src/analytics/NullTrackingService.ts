import { RouteLocationNormalized } from 'vue-router'

import { TrackingProvider } from './TrackingProvider'
import { TrackingService } from './TrackingService'

export class NullTrackingService implements TrackingService {

  public initializeProvider(): void {
    // no-op
  }

  public identifyUser(user: any): void {
    // no-op
  }

  public handleRouteChanged(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
    // no-op
  }

  public getTrackingProvider(name?: string): TrackingProvider | undefined {
    return undefined
  }
}
