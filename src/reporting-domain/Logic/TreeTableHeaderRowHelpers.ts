import { SortDirection, TreeTableHeaderCell, TreeTableHeaderRow } from '../TreeTable'

export function getSortedHeaderCellWithIndex(headers: Array<TreeTableHeaderRow>) {
  let sortHeader: Array<{ cell: TreeTableHeaderCell; index: number }>

  if (!headers || !headers.length) {
    return
  }

  const row = headers[headers.length - 1]
  sortHeader = row.cells
    .map((cell: TreeTableHeaderCell, index: number) => {
      const result = {
        cell,
        index,
      }
      return result
    })
    .filter(_ => _.cell.columnSorter && _.cell.columnSorter.sortDirection !== SortDirection.None)

  return sortHeader[0]
}
