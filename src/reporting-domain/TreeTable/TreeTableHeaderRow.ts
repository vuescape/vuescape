import { TreeTableHeaderCell } from './TreeTableHeaderCell'

export interface TreeTableHeaderRow {
  id: string
  cells: Array<TreeTableHeaderCell>
  cssClasses?: string
  // can be a string or an object
  renderer: string | any
}
