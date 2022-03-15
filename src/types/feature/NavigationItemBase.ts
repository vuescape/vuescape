import { NavigationItemKind } from './NavigationItemKind'
import { NavigationLink } from './NavigationLink'

export interface NavigationItemBase {
  link: NavigationLink
  kind: NavigationItemKind
}
