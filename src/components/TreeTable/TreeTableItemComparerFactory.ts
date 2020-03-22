import { SortDirection } from './SortDirection'
import { TreeTableRow } from './TreeTableRow'

import { SortStrategy } from '../../infrastructure'

export function makeTreeTableItemPropertyCompare(
  sortOnProperty: string,
  sortStrategy: SortStrategy = SortStrategy.Default,
  sortDirection: SortDirection,
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

    const leftItem = (left as TreeTableRow).items.filter(_ => _.id === sortOnProperty)
    const rightItem = (right as TreeTableRow).items.filter(_ => _.id === sortOnProperty)

    if (leftItem.length === 0 && rightItem.length === 0) {
      return 0
    }

    if (leftItem.length === 0 && rightItem.length > 0) {
      return -1
    }

    if (leftItem.length > 0 && rightItem.length === 0) {
      return 1
    }

    let leftItemValue = leftItem[0].value
    let rightItemValue = rightItem[0].value

    if (sortStrategy === SortStrategy.StringCaseInsensitive) {
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