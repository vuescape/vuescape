import { LinkName, LinkTarget } from '@vuescape/reporting-domain/Link'
import { TreeTableCell } from './TreeTableCell'
import { TreeTableRow } from './TreeTableRow'

export function selfLinkClickHandler(row: TreeTableRow, cell: TreeTableCell) {
  if (!cell || !cell.links) {
    return
  }

  const selfLink = cell.links[LinkName.Self]
  if (selfLink) {
    const source = selfLink.source
    const target = selfLink.linkTarget

    switch (target) {
      case LinkTarget.Download:
        // set state to download a file
        break
      // TODO: Do we need a ModalApi and ModalText kind?
      case LinkTarget.Modal:
        // Set state to open a modal and retrieve source
        break
      case LinkTarget.CenterPane:
        // set state to load source in center pane
        break
      case LinkTarget.LeftPane:
        // set state to load source in left pane
        break
      case LinkTarget.RightPane:
        // set state to load source in right pane
        break
      case LinkTarget.CurrentWindow:
        // set state to navigate to source in center pane
        // TODO: determine if absolute or relative url to see if we should perform a route or location.url
        break
      case LinkTarget.NewWindow:
        // set state to load a URL
        // TODO: determine if absolute or relative url to see if we should perform a route or location.url
        break
      default:
        throw Error('Invalid linkTarget: ' + target)
        break
    }
  }
}

// export function toggleExpanded(row?: TreeTableRow, shouldRecurse = false, shouldExecuteAsync = true) {

// }

// export async function expandOrCollapseAll(isExpanded: boolean) {
//   const self = this
//   self.isPerformingLongRunningOperation = true
//   setTimeout(async () => {
//     self.allRows.forEach(setRow =>
//       self.setRowProperty(setRow, isExpanded, (r, val) => {
//         if (r.isExpandable) {
//           r.isExpanded = isExpanded
//         }
//       }),
//     )
//     await self.$nextTick()
//     self.adjustTreeTableSizingForTable()
//     self.isPerformingLongRunningOperation = false
//   }, BenchmarkingReport.DEFAULT_TIMEOUT)
// }

// export function setRowProperty(
//   row: TreeTableRow,
//   propertyValue: any,
//   setProperty: (r: TreeTableRow, val: any) => void,
//   shouldRecurseChildren = true,
// ) {
//   setProperty(row, propertyValue)
//   // TODO: Maybe all dependencies should always be handled?
//   handleTotalRowDependencies(row)

//   if (shouldRecurseChildren && row.children && row.children.length > 0) {
//     row.children.forEach(r => setRowProperty(r, propertyValue, setProperty, shouldRecurseChildren))
//   }
// }

// export function handleTotalRowDependencies(row: TreeTableRow) {
//   if (row.dependencies) {
//     const toggleDependencies = row.dependencies.filter(
//       _ => _.treeTableRowDependencyBehavior === 'totalRowDisplayToggleBehavior',
//     )
//     for (const toggleDependency of toggleDependencies) {
//       const target = toggleDependency.payload as TreeTableRow
//       row.cells.forEach((_: TreeTableCell, index: number) => {
//         if (index !== 0) {
//           _.renderer = row.isExpanded ? EmptyCellRenderer : undefined
//           // Remove expanded row rating style
//           this.adjustRatingClasses(row, _, target.cells[index].cssClasses)
//         }
//       })
//       setRowProperty(target, row.isExpanded, (r1, val1) => (r1.isVisible = val1), false)
//     }
//   }
// }
