import { TreeTableCell } from './TreeTableCell'
import { TreeTableRowDependency } from './TreeTableRowDependency'

import { Dictionary, Link } from '@vuescape/index'

export interface TreeTableRow {
  // unique identifier for this row.  This will be used as a key for updating the DOM.
  id: string
  cells: Array<TreeTableCell>
  isExpandable: boolean
  isExpanded: boolean
  isVisible: boolean
  isSelected: boolean
  isFocused?: boolean
  depth: number
  cssClasses?: string
  onclick?: () => void
  // can be a string or an object
  renderer?: string | any
  // Dependencies are used to track dependencies (could be between rows or something else) for a row
  // The specific implementation of when and how to handle those dependencies is up to the author.
  dependencies?: Array<TreeTableRowDependency>
  children?: Array<TreeTableRow>
  // Any value
  value?: any
  links?: Dictionary<Array<Link>>
}
