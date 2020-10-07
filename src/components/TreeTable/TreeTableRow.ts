import { TreeTableItem } from './TreeTableItem'
import { TreeTableItemDependency } from './TreeTableItemDependency'

export interface TreeTableRow {
  id: string // id will be the path e.g. 'Income Statement| Gross Profit' for gross profit
  // Could be value instead of text property name
  name: string
  items: Array<TreeTableItem>
  isExpandable: boolean
  isExpanded: boolean
  isVisible: boolean
  isSelected: boolean
  isFocused?: boolean
  depth: number
  cssClasses?: string
  onclick?: () => void
  // can be a string or an object
  renderer?: any 
  // Dependencies are an array of strings.  The string values are ids of other items in the tree
  dependencies?: Array<TreeTableItemDependency>
  children?: Array<TreeTableRow>
  // Any value that contains the object representation of the 
  value? : any
}
