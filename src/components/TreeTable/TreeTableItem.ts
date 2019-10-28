import { TreeTableRow } from './TreeTableRow'

export interface TreeTableItem {

  id: string
  // TODO: should value just be a string? or should it be really be any?
  value: any 
  title?: string
  renderer?: string
  cssClasses?: string
  colspan?: number
  // Use this for clicking expand/collapse
  onclick?: (row?: TreeTableRow, item?: TreeTableItem) => void
}
