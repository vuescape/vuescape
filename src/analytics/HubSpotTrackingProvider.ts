import { TrackingProvider } from './TrackingProvider'

export class HubSpotTrackingProvider implements TrackingProvider {
  private hubId: string
  private isInitialized = false

  constructor(hubId: string) {
    this.hubId = hubId
  }

  public identify(user: string): void {
    if (!this.isInitialized) {
      this.getHsq().push([
        'identify',
        {
          email: user,
        },
      ])

      this.init()
    }
  }

  public init(): void {
    // Only init once
    if (!this.isInitialized) {
      const script = document.createElement('script')
      script.setAttribute('src', `//js.hs-scripts.com/${this.hubId}.js`)
      script.setAttribute('type', 'text/javascript')
      script.async = true
      script.defer = true

      document.head.appendChild(script)

      this.isInitialized = true
    }
  }

  public trackPageView(urlFragment: string): void {
    // Only track pages once the user is known
    if (this.isInitialized) {
      const hsq = this.getHsq()
      hsq.push(['setPath', urlFragment])
      hsq.push(['trackPageView'])
    }
  }

  public sendEvent(eventName: string, payload: any): void {
    throw new Error('Method not implemented.')
  }

  private getHsq(): Array<any> {
    const hsq = ((window as any)._hsq = (window as any)._hsq || [])
    return hsq
  }
}
