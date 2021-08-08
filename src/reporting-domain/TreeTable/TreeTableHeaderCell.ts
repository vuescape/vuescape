import { ColumnSorter, TreeTableCell } from '@vuescape/index'

export interface TreeTableHeaderCell extends TreeTableCell {
  columnSorter?: ColumnSorter
}
