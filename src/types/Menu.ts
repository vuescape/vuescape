export interface Menu {
  // id should be a unique id such as a GUID
  id: string
  title: string
  ariaLabel?: string
  icon?: string
  path: string
  items?: Array<Menu>
  isDivider?: boolean
}
