import VueRouter from 'vue-router'

import { Chiclet } from '../Chiclet'
import { Menu } from '../Menu'

import { Feature } from './Feature'
import { FeatureNavigationRegistration } from './FeatureNavigationRegistration'

export interface FeatureService {
  fetch(forceLoad?: boolean): Promise<void>
  getFeatureNavigationRegistrations(): Promise<Array<FeatureNavigationRegistration>>
  getFeatures(): Promise<Array<Feature>>
  getFeature(featureId: string): Promise<Feature | undefined>

  getMenus(): Promise<Array<Menu & { menuTitlePath: string }>>
  getChiclets(router: VueRouter): Promise<Array<Chiclet>>
}
