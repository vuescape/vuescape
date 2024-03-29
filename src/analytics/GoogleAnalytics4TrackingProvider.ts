import { addScript, loadScriptFromUrl } from '@vuescape/infrastructure'
import { TrackingProvider } from './TrackingProvider'

// tslint:disable-next-line: ban-types
declare var gtag: Function

export class GoogleAnalytics4TrackingProvider implements TrackingProvider {
  private trackingId: string
  private isInitialized = false

  constructor(trackingId: string) {
    this.trackingId = trackingId
  }

  public get name() {
    return 'google-analytics-4'
  }

  public identify(user: string): void {
    // Not using Google Analytics to identify so just init the provider
    this.init()
  }

  public init(): void {
    if (!this.isInitialized) {
      loadScriptFromUrl(`https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`)

      const scriptContent = `
window.dataLayer = window.dataLayer || []
function gtag() { dataLayer.push(arguments) }
gtag('js', new Date())
gtag('config', '${this.trackingId}', { send_page_view: false })
`
      addScript(scriptContent)
      this.isInitialized = true
    }
  }

  public trackPageView(urlFragment: string): void {
    if (this.isInitialized) {
      gtag('config', `${this.trackingId}`, { page_path: urlFragment })
    }
  }

  public sendEvent(eventName: string, payload: any): void {
    gtag('send', eventName, ...payload)
  }
}
