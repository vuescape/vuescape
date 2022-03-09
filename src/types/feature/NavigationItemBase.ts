import { NavigationItemKind } from './NavigationItemKind'
import { NavigationLink } from './NavigationLink'

export interface NavigationItemBase {
  navigationLink: NavigationLink
  navigationItemKind: NavigationItemKind
}
