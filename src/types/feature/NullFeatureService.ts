import VueRouter from 'vue-router'

import { Chiclet, Menu } from '@vuescape/types'

import { Feature } from '@vuescape/types/feature/Feature'
import { FeatureNavigationRegistration } from '@vuescape/types/feature/FeatureNavigationRegistration'
import { FeatureService } from '@vuescape/types/feature/FeatureService'

export class NullFeatureService implements FeatureService {
  public async fetch(forceLoad?: boolean): Promise<void> {
    // noop
  }

  public async getFeatureNavigationRegistrations(): Promise<Array<FeatureNavigationRegistration>> {
    return []
  }

  public async getFeatures(): Promise<Array<Feature>> {
    return []
  }

  public async getFeature(featureId: string): Promise<Feature | undefined> {
    return undefined
  }

  public async getMenus(): Promise<(Array<Menu & { menuTitlePath: string }>)> {
    return []
  }

  public async getChiclets(router: VueRouter): Promise<Array<Chiclet>> {
    return []
  }
}
