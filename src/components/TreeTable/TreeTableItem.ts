import { TreeTableRow } from './TreeTableRow'

export interface TreeTableItem {
  id: string
  value: any
  displayValue?: string
  hover?: { component?: any, title?: string; text?: string; html?: string }
  triggerHoverInCells?: Array<string> 
  renderer?: any
  cssClasses?: string
  colspan?: number
  // Use this for clicking expand/collapse
  onclick?: (row?: TreeTableRow, item?: TreeTableItem) => void
  extendedProperties?: any
}
