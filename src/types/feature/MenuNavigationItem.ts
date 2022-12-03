import { HorizontalAlignment } from '@vuescape/reporting-domain/TreeTable/HorizontalAlignment'
import { NavigationItemBase } from '@vuescape/types'

export interface MenuNavigationItem extends NavigationItemBase {
  menuTitlePath: string
  horizontalAlignment : HorizontalAlignment
  shouldFireClickEvent?: boolean
}
