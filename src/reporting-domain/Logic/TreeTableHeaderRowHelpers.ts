import { SortDirection, TreeTableHeaderCell, TreeTableHeaderRow } from '../TreeTable'

export function getSortedHeaderCellWithIndex(headers: Array<TreeTableHeaderRow>) {
  let sortHeader: Array<{ cell: TreeTableHeaderCell; index: number }>

  for (const row of headers) {
    sortHeader = row.cells
      .map((cell: TreeTableHeaderCell, index: number) => {
        const result = { cell, index }
        return result
      })
      .filter(_ => _.cell.columnSorter && _.cell.columnSorter.sortDirection !== SortDirection.None)

    return sortHeader[0]
  }
}
