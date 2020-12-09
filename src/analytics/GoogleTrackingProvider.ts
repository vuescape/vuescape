import { TrackingProvider } from './TrackingProvider'

export class GoogleTrackingProvider implements TrackingProvider {
  private trackingId: string


  constructor(trackingId: string) {
    this.trackingId = trackingId
  }

  public identify(user: string): void {
    throw new Error('Method not implemented.')
  }

  public init(): void {
    throw new Error('Method not implemented.')
  }
  
  public trackPageView(urlFragment: string): void {
    throw new Error('Method not implemented.')
  }
  
  public sendEvent(eventName: string, payload: any): void {
    throw new Error('Method not implemented.')
  }
}
