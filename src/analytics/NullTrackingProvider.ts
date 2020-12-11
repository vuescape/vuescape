import { TrackingProvider } from './TrackingProvider'

export class NullTrackingProvider implements TrackingProvider {
  public identify(user: string): void {
    // no-op
  }
  
  public get name() {
    return 'NullTrackingProvider'
  }

  public init(): void {
    // no-op
  }

  public trackPageView(urlFragment: string): void {
    // no-op
  }

  public sendEvent(eventName: string, payload: any): void {
    // no-op
  }
}
