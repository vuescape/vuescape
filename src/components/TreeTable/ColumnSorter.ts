import { SortDirection } from './SortDirection'

import { SortComparisonStrategy } from '@vuescape/index'

export interface ColumnSorter {
  sortByCellId: string
  sortDirection: SortDirection
  sortComparisonStrategy?: SortComparisonStrategy
}
