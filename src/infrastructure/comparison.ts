export function makePropertyCompare(sortOnProperty: string) {
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
