import { NavigationItemBase } from "./NavigationItemBase"

export interface FeatureNavigationRegistration {
  id: string
  featureId: string
  navigationItems: Array<NavigationItemBase>
}
