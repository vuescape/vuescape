import { Route } from 'vue-router'

import { TrackingProvider } from './TrackingProvider'
import { TrackingService } from './TrackingService'

export class NullTrackingService implements TrackingService {

  public initializeProvider(): void {
    // no-op
  }

  public identifyUser(user: any): void {
    // no-op
  }

  public handleRouteChanged(to: Route, from: Route): void {
    // no-op
  }

  public getTrackingProvider(name?: string): TrackingProvider | undefined {
    return undefined
  }
}
