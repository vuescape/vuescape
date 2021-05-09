import { SortDirection } from './SortDirection'
import { TreeTableRow } from './TreeTableRow'

import { SortComparisonStrategy } from '../../infrastructure'

export function makeTreeTableItemPropertyCompare(
  sortOnCell: string,
  sortDirection: SortDirection,
  sortComparisonStrategy: SortComparisonStrategy = SortComparisonStrategy.Default,
) {
  if (sortDirection === SortDirection.None) {
    throw new Error('Cannot perform a sort with a SortDirection value of None.')
  }

  return (left: any, right: any) => {
    if (!left && !right) {
      return 0
    }
    if (!left && right) {
      return -1
    }
    if (left && !right) {
      return 1
    }

    const leftItem = (left as TreeTableRow).items.filter(_ => _.id === sortOnCell)
    const rightItem = (right as TreeTableRow).items.filter(_ => _.id === sortOnCell)

    if (leftItem.length === 0 && rightItem.length === 0) {
      return 0
    }

    if (leftItem.length === 0 && rightItem.length > 0) {
      return -1
    }

    if (leftItem.length > 0 && rightItem.length === 0) {
      return 1
    }

    let leftItemValue = leftItem[0].value != null ? leftItem[0].value : leftItem[0].displayValue 
    let rightItemValue = rightItem[0].value != null ? rightItem[0].value : rightItem[0].displayValue

    if (sortComparisonStrategy === SortComparisonStrategy.StringCaseInsensitive) {
      leftItemValue = (leftItemValue || '').toUpperCase()
      rightItemValue = (rightItemValue || '').toUpperCase()
    }

    if (leftItemValue < rightItemValue) {
      return 1 * sortDirection
    }
    if (leftItemValue > rightItemValue) {
      return -1 * sortDirection
    }
    return 0
  }
}
