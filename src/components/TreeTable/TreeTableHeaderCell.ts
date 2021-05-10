import { ColumnSorter } from './ColumnSorter';
import { SortDirection } from './SortDirection'

export interface TreeTableHeaderCell {
  id: string
  displayValue: string
  cssClasses?: string
  colspan?: number
  columnSorter? : ColumnSorter
  renderer?: string  
  // TODO: do we want to support explicit Handlers?  What other event handlers do we want?
  // Also, do we want to support args (e.g. MouseEvent)
  // Also, use lower case onclick since that is correct HTML but perhaps not strictly correct for naming
  onclick?: () => void
  onmouseenter?: () => void
  onmousexit?: () => void
}
