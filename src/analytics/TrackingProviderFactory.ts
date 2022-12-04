import { GoogleAnalytics4TrackingProvider } from './GoogleAnalytics4TrackingProvider'
import { GoogleUniversalAnalyticsTrackingProvider } from './GoogleUniversalAnalyticsTrackingProvider'
import { HubSpotTrackingProvider } from './HubSpotTrackingProvider'
import { NullTrackingProvider } from './NullTrackingProvider'

export class TrackingProviderFactory {
  public static getTrackingProvider(name: string, trackingId: string) {
    const hubSpotTrackingProvider = new HubSpotTrackingProvider(trackingId)
    if (name === hubSpotTrackingProvider.name) {
      return hubSpotTrackingProvider
    }

    const googleAnalytics4TrackingProvider = new GoogleAnalytics4TrackingProvider(trackingId)
    if (name === googleAnalytics4TrackingProvider.name) {
      return googleAnalytics4TrackingProvider
    }

    const googleUniversalAnalyticsTrackingProvider = new GoogleUniversalAnalyticsTrackingProvider(trackingId)
    if (name === googleUniversalAnalyticsTrackingProvider.name) {
      return googleUniversalAnalyticsTrackingProvider
    }

    const nullTrackingProvider = new NullTrackingProvider()
    if (name === nullTrackingProvider.name) {
      return nullTrackingProvider
    }

    throw new Error('Unsupported tracking provider name: ' + name)
  }
}
