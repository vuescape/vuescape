import { TreeTableRow } from './TreeTableRow'

import { Dictionary, Hover, Link } from '@vuescape/index'

export interface TreeTableCell {
  id: string
  displayValue?: string
  value: any
  hover?: Hover
  triggerHoverInCells?: Array<string> 
  renderer?: string | (() => Promise<any>)
  cssClasses?: string
  colspan?: number
  // Use this for clicking expand/collapse
  onclick?: (row?: TreeTableRow, item?: TreeTableCell) => void
  extendedProperties?: any
  isVisible? : boolean
  links? : Dictionary<Array<Link>> 
}
