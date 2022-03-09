import VueRouter from 'vue-router'

import { Chiclet } from '../Chiclet'
import { Menu } from '../Menu'

import { Feature } from './Feature'
import { FeatureNavigationRegistration } from './FeatureNavigationRegistration'

export interface FeatureService {
  fetch(forceLoad?: boolean): Promise<void>
  readonly menus: Array<Menu & { menuTitlePath: string }>

  readonly featureNavigationRegistrations: Array<FeatureNavigationRegistration>

  readonly features: Array<Feature>

  getChiclets(router: VueRouter): Array<Chiclet>
  
  getFeature(featureId: string): Feature | undefined
}
