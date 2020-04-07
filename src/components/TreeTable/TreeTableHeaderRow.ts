import { TreeTableHeaderItem } from './TreeTableHeaderItem'

export interface TreeTableHeaderRow {
  id: string 
  items: Array<TreeTableHeaderItem>
  cssClasses?: string
}
