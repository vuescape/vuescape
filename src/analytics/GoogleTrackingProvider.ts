import { TrackingProvider } from './TrackingProvider'

// tslint:disable-next-line: ban-types
declare var ga: Function

export class GoogleTrackingProvider implements TrackingProvider {
  private trackingId: string
  private isInitialized = false

  constructor(trackingId: string) {
    this.trackingId = trackingId
  }

  public get name() {
    return 'google-analytics'
  }

  public identify(user: string): void {
    // Not using Google Analytics to identify so just init the provider
    this.init()
  }

  public init(): void {
    if (!this.isInitialized) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.text = `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  
      ga('create', '${this.trackingId}', 'auto');`

      document.head.appendChild(script)
      this.isInitialized = true
    }
  }

  public trackPageView(urlFragment: string): void {
    if (this.isInitialized) {
      ga('set', 'page', urlFragment)
      ga('send', 'pageview')
    }
  }

  public sendEvent(eventName: string, payload: any): void {
    throw new Error('Method not implemented.')
  }
}
