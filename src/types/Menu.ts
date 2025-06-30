import { HorizontalAlignment } from '@vuescape/reporting-domain/TreeTable/HorizontalAlignment'

export interface Menu {
  // id should be a unique id such as a GUID
  id: string
  title: string
  cssClass?: string
  ariaLabel?: string
  icon?: string
  path: string
  items?: Array<Menu>
  isDivider?: boolean
  horizontalAlignment?: HorizontalAlignment
  shouldFireClickEvent?: boolean

  // Set an image src
  imageSrc?: string

  // This is not used for navigation.
  // Override paths to use if this item should be considered active
  // when the actual route in the browser differs from the Menu path.
  // If not specified then the path is used to determine if a route is active.
  pathIsActiveWhen?: Array<string>
}
