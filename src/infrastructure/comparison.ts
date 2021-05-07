import { SortStrategy } from './SortStrategy'

export function makePropertyComparer(sortOnProperty: string, sortStrategy: SortStrategy = SortStrategy.Default) {
  if (sortStrategy === SortStrategy.StringCaseInsensitive) {
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

  if (sortStrategy === SortStrategy.StringOrdinal) {
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

  if (sortStrategy === SortStrategy.Default) {
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

  throw new Error('Unsupported SortStrategy: ' + sortStrategy)
}
