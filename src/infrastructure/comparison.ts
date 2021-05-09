import { SortComparisonStrategy } from './SortComparisonStrategy'

export function makePropertyComparer(sortOnProperty: string, sortComparisonStrategy: SortComparisonStrategy = SortComparisonStrategy.Default) {
  if (sortComparisonStrategy === SortComparisonStrategy.StringCaseInsensitive) {
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
      if (left[sortOnProperty].toUpperCase() < right[sortOnProperty].toUpperCase()) {
        return -1
      }
      if (left[sortOnProperty].toUpperCase() > right[sortOnProperty].toUpperCase()) {
        return 1
      }
      return 0
    }
  }

  if (sortComparisonStrategy === SortComparisonStrategy.StringOrdinal) {
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
      if (left[sortOnProperty].toString() < right[sortOnProperty].toString()) {
        return -1
      }
      if (left[sortOnProperty].toString() > right[sortOnProperty].toString()) {
        return 1
      }
      return 0
    }
  }

  if (sortComparisonStrategy === SortComparisonStrategy.Default) {
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
      if (left[sortOnProperty] < right[sortOnProperty]) {
        return -1
      }
      if (left[sortOnProperty] > right[sortOnProperty]) {
        return 1
      }
      return 0
    }
  }

  throw new Error('Unsupported SortComparisonStrategy: ' + SortComparisonStrategy)
}
