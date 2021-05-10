import { TreeTableHeaderCell } from './TreeTableHeaderCell'

export interface TreeTableHeaderRow {
  id: string 
  cells: Array<TreeTableHeaderCell>
  cssClasses?: string
}
