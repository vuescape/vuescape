import VueRouter from 'vue-router'

import { Chiclet, Menu } from '@vuescape/types'

import { Feature } from '@vuescape/types/feature/Feature'
import { FeatureNavigationRegistration } from '@vuescape/types/feature/FeatureNavigationRegistration'
import { FeatureService } from '@vuescape/types/feature/FeatureService'

export class NullFeatureService implements FeatureService {
  public async fetch(): Promise<void> {
    // noop
  }
  public get menus(): Array<Menu & {menuTitlePath: string}> {
    return []
  }
  public get featureNavigationRegistrations(): Array<FeatureNavigationRegistration> {
    return []
  }
  public get features(): Array<Feature> {
    return []
  }
  public   getChiclets(router: VueRouter): Array<Chiclet>  {
    return []
  }
  public getFeature(featureId: string): Feature | undefined {
    return undefined
  }
}
