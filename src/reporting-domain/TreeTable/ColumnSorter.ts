import { SortDirection } from './SortDirection'

import { SortComparisonStrategy } from '@vuescape/index'

export interface ColumnSorter {
  sortDirection: SortDirection
  sortComparisonStrategy?: SortComparisonStrategy
}
