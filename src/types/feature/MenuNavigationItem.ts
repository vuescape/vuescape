import { NavigationItemBase } from './NavigationItemBase'
import { HorizontalAlignment } from '@vuescape/reporting-domain'

export interface MenuNavigationItem extends NavigationItemBase {
  menuTitlePath: string
  horizontalAlignment : HorizontalAlignment
  shouldFireClickEvent?: boolean
}
