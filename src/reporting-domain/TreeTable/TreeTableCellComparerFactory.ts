import { SortDirection } from './SortDirection'
import { TreeTableRow } from './TreeTableRow'

import { SortComparisonStrategy } from '../../infrastructure'

export function makeTreeTableCellPropertyCompare(
  sortOnIndex: number,
  sortDirection: SortDirection,
  sortComparisonStrategy: SortComparisonStrategy = SortComparisonStrategy.Default,
  doNotSortValue?: any | undefined,
) {
  if (sortDirection === SortDirection.None) {
    throw new Error('Cannot perform a sort with a SortDirection value of None.')
  }
  const collator = new Intl.Collator()

  return (left: any, right: any) => {
    if (left == null && right == null) {
      return 0
    }
    if (left == null && right != null) {
      return -1
    }
    if (left != null && right == null) {
      return 1
    }

    const leftItem  = (left as TreeTableRow).cells
      .filter(_ => _.isVisible !== false)
      .filter((_, index) => index === sortOnIndex)
    const rightItem = (right as TreeTableRow).cells
      .filter(_ => _.isVisible !== false)
      .filter((_, index) => index === sortOnIndex)

    if (leftItem.length === 0 && rightItem.length === 0) {
      return 0
    }

    if (leftItem.length === 0 && rightItem.length > 0) {
      return -1
    }

    if (leftItem.length > 0 && rightItem.length === 0) {
      return 1
    }

    const leftItemValue  = leftItem[0].value != null ? leftItem[0].value : leftItem[0].displayValue
    const rightItemValue = rightItem[0].value != null ? rightItem[0].value : rightItem[0].displayValue

    if (doNotSortValue != null) {
      if (leftItemValue === doNotSortValue || rightItemValue === doNotSortValue) {
        return 0
      }
    }

    if (leftItemValue == null && rightItemValue == null) {
      return 0
    }
    if (leftItemValue == null && rightItemValue != null) {
      return -1
    }
    if (leftItemValue != null && rightItemValue == null) {
      return 1
    }

    if (sortComparisonStrategy === SortComparisonStrategy.StringCaseInsensitive) {
      const result = rightItemValue.toString().localeCompare(leftItemValue) * sortDirection
      return result
    }

    if (typeof leftItemValue === typeof rightItemValue) {
      if (leftItemValue.valueOf() < rightItemValue.valueOf()) {
        return 1 * sortDirection
      }

      if (leftItemValue.valueOf() > rightItemValue.valueOf()) {
        return -1 * sortDirection
      }

      return 0
    }

    return collator.compare(leftItemValue, rightItemValue) * sortDirection * -1
  }
}
