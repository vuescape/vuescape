export interface TrackingProvider {
  init(): void
  identify(user: string) : void
  trackPageView(urlFragment: string): void
  sendEvent(eventName: string, payload: any): void
}
