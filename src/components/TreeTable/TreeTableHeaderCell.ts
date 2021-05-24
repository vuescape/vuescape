import { TreeTableCell } from '@vuescape/index'

import { ColumnSorter } from './ColumnSorter'

export interface TreeTableHeaderCell extends TreeTableCell {
  columnSorter?: ColumnSorter
}
