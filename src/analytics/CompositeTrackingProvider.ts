import { TrackingProvider } from './TrackingProvider'

export class CompositeTrackingProvider implements TrackingProvider {
  private trackingProviders : Array<TrackingProvider>

  constructor(...trackingProviders : Array<TrackingProvider> ) {
    this.trackingProviders = trackingProviders
  }

  public identify(user: string): void {
    this.trackingProviders.forEach(_ => _.identify(user))
 }

  public init(): void {
    this.trackingProviders.forEach(_ => _.init())
  }

  public trackPageView(urlFragment: string): void {
    this.trackingProviders.forEach(_ => _.trackPageView(urlFragment))
  }

  public sendEvent(eventName: string, payload: any): void {
    throw new Error('Method not implemented.')
  }
}
