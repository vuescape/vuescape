import { TreeTableRow } from './TreeTableRow'

import { Dictionary, Link } from '@vuescape/index'

export interface TreeTableCell {
  id: string
  value: any
  displayValue?: string
  hover?: { component?: any, title?: string; text?: string; html?: string }
  triggerHoverInCells?: Array<string> 
  renderer?: any
  cssClasses?: string
  colspan?: number
  // Use this for clicking expand/collapse
  onclick?: (row?: TreeTableRow, item?: TreeTableCell) => void
  extendedProperties?: any
  isVisible? : boolean
  links? : Dictionary<Array<Link>> 
}
