<template>
  <div :id="uniqueId" :ref="uniqueId" :key="uniqueId" class="tree-table-v2__div--box" :style="cssStyleObject">
    <vue-scrolling-table
      :scroll-horizontal="shouldScrollHorizontalValue"
      :scroll-vertical="shouldScrollVerticalValue"
      :sync-header-scroll="shouldSyncHeaderScrollValue"
      :sync-footer-scroll="shouldSyncFooterScrollValue"
      :include-footer="shouldIncludeFooterValue"
      :dead-area-color="deadAreaColorValue"
      :class="cssClass"
    >
      <template slot="thead">
        <header-row-renderer
          v-for="headerRow in headersToDisplay"
          :key="headerRow.id"
          :row="headerRow"
          @toggle-sort="toggleSort($event)"
        ></header-row-renderer>
      </template>
      <template slot="tbody">
        <row-renderer v-for="row in rowsToDisplay" :key="row.id" :row="row"></row-renderer>
      </template>
      <template slot="tfoot">
        <row-renderer v-for="footer in footersToDisplay" :key="footer.id" :row="footer"></row-renderer>
      </template>
    </vue-scrolling-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import VueScrollingTable from 'vue-scrolling-table'
import { namespace } from 'vuex-class'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import {
  Dictionary,
  getSortedHeaderCellWithIndex,
  Guid,
  makeTreeTableCellPropertyCompare,
  SortDirection,
  TreeTableHeaderCell,
  TreeTableHeaderRow,
  TreeTableRow,
} from '@vuescape/index'

import { ColumnDefinition, ColumnWidthBehavior, ColumnWrapBehavior, SortLevel } from '@vuescape/reporting-domain'
import { UnitOfMeasure } from '@vuescape/reporting-domain/UnitOfMeasure'
import HeaderRowRenderer from './HeaderRowRenderer.vue'
import RowRenderer from './RowRenderer.vue'

@Component({
  components: { HeaderRowRenderer, RowRenderer, VueScrollingTable },
})
export default class TreeTable extends ComponentBase {
  private uniqueId: string

  @Prop({ type: String, required: false })
  private id: string

  @Prop({ type: Array, required: false, default: () => [] })
  private columnDefinitions: Array<ColumnDefinition>

  @Prop({ type: Array, required: false, default: () => [] })
  private headers: Array<TreeTableHeaderRow>

  @Prop({ type: Array, required: false, default: () => [] })
  private footers: Array<TreeTableRow>

  @Prop({ type: Array, required: true })
  private rows: Array<TreeTableRow>

  @Prop({ type: Boolean, required: false, default: true })
  private shouldScrollVertical: boolean

  @Prop({ type: Boolean, required: false, default: true })
  private shouldScrollHorizontal: boolean

  @Prop({ type: Boolean, required: false, default: true })
  private shouldSyncHeaderScroll: boolean

  @Prop({ type: Boolean, required: false, default: true })
  private shouldSyncFooterScroll: boolean

  @Prop({ type: Boolean, required: false, default: false })
  private shouldIncludeFooter: boolean

  @Prop({ type: String, required: false, default: '#FFFFFF' })
  private deadAreaColor: string

  @Prop({ type: Number, required: false, default: 100000 })
  private maxRows: number

  @Prop({ type: Object, required: false })
  private cssStyles: Dictionary<string>

  @Prop({ type: String, required: false })
  private cssClass: string

  @Prop({ type: Number, default: SortLevel.None })
  private sortLevel: SortLevel

  @Prop({ type: Function, required: false })
  private treeTableSorter?: (rows: Array<TreeTableRow>, headers: Array<TreeTableHeaderRow>) => Array<TreeTableRow>

  @namespace('window/availableHeight').State(state => state.value)
  private availableHeight: Array<number>

  private treeTableSorterImpl: (rows: Array<TreeTableRow>, headers: Array<TreeTableHeaderRow>) => Array<TreeTableRow> =
    this.defaultTreeTableSorter

  private rowsToDisplay: Array<TreeTableRow> = []

  private get cssStyleObject() {
    const result: any = {}
    if (!this.cssStyles) {
      return result
    }

    const cssProperties = Object.keys(this.cssStyles)
    for (const cssProperty of cssProperties) {
      result[cssProperty] = this.cssStyles[cssProperty]
    }
    return result
  }

  private get headersToDisplay() {
    return this.headers
  }

  private get footersToDisplay() {
    return this.footers
  }

  private get shouldScrollVerticalValue() {
    return this.shouldScrollVertical
  }

  private get shouldScrollHorizontalValue() {
    return this.shouldScrollHorizontal
  }

  private get shouldSyncHeaderScrollValue() {
    return this.shouldSyncFooterScroll
  }

  private get shouldSyncFooterScrollValue() {
    return this.shouldSyncFooterScroll
  }

  private get shouldIncludeFooterValue() {
    return this.shouldIncludeFooter
  }

  private get deadAreaColorValue() {
    return this.deadAreaColor
  }

  private get maxRowsValue() {
    return this.maxRows
  }

  @Watch('availableHeight')
  private availableHeightWatcher(val: any, oldVal: any) {
    // TODO: If setting tree table height then do it here or in function
    // this.treeTableStyle = this.getTreeTableStyle()
    this.adjustTreeTableSizingForTable()
  }

  @Watch('rows')
  private rowsWatcher(val: Array<TreeTableRow>, oldVal: Array<TreeTableRow>) {
    this.rows = val
    this.setRowsToDisplay()
  }

  private getColumnDefinition(columnDefinitionIndex?: number) {
    if (columnDefinitionIndex == null) {
      return
    }

    const result = this.columnDefinitions[columnDefinitionIndex]
    return result
  }

  private toggleSort(header: TreeTableHeaderCell) {
    if (header.columnSorter) {
      let newSortDirection = SortDirection.Ascending
      if (header.columnSorter.sortDirection === undefined || header.columnSorter.sortDirection === SortDirection.None) {
        newSortDirection = SortDirection.Ascending
      }
      else if (
        header.columnSorter.sortDirection === SortDirection.Ascending ||
        header.columnSorter.sortDirection === SortDirection.Descending
      ) {
        newSortDirection = header.columnSorter.sortDirection * -1
      }
      else {
        throw new Error('Unsupported SortDirection: ' + header.columnSorter.sortDirection)
      }
      this.headers.forEach(_ =>
        _.cells.forEach(col => (col.columnSorter ? (col.columnSorter.sortDirection = SortDirection.None) : undefined)),
      )
      header.columnSorter.sortDirection = newSortDirection
      this.setRowsToDisplay()
    }
  }

  private toggleExpanded(row?: TreeTableRow) {
    if (row) {
      const isRowExpanded = !row.isExpanded
      if (row.children) {
        row.children.forEach((childRow: any) => {
          // Set to visible
          childRow.isVisible = isRowExpanded
          console.log(childRow.id)
        })
      }
      row.isExpanded = isRowExpanded
    }
  }

  private defaultTreeTableSorter(rows: Array<TreeTableRow>, headers: Array<TreeTableHeaderRow>) {
    const sortHeader = getSortedHeaderCellWithIndex(headers)
    if (this.sortLevel === SortLevel.None || !sortHeader) {
      return rows
    }

    const propertySorter = makeTreeTableCellPropertyCompare(
      sortHeader.index,
      sortHeader.cell.columnSorter!.sortDirection,
      sortHeader.cell.columnSorter!.sortComparisonStrategy,
    )

    const hasChildren = rows.filter(_ => _.children!.length > 0).length > 0
    if (this.sortLevel === SortLevel.Children && !hasChildren) {
      console.warn(`sortLevel set to ${SortLevel.Children.toString()} but there are no children.`)
    }

    if (this.sortLevel === SortLevel.Children) {
      rows.forEach(_ => {
        _.children = _.children!.sort(propertySorter)
      })
    }

    if (this.sortLevel === SortLevel.Parent) {
      return rows.sort(propertySorter)
    }

    return rows
  }

  private async setRowsToDisplay() {
    if (!document) {
      return
    }

    const rows = this.rows.slice(0, this.maxRows).filter(row => row.isVisible || row.shouldDisplayChildren)
    this.rowsToDisplay = this.treeTableSorterImpl(rows, this.headers)
    const tableBody = document.querySelector(`div[id='${this.uniqueId}'] table.scrolling tbody`) as {
      scrollTop: number,
    }
    if (tableBody) {
      const scrollTop = tableBody.scrollTop
      await this.$nextTick()
      tableBody.scrollTop = scrollTop
      this.adjustTreeTableSizingForTable()
    }
  }

  private adjustTreeTableSizingForTable() {
    const table = document.querySelector(`div[id='${this.uniqueId}'] table.scrolling`) as HTMLTableElement
    this.adjustTreeTableSizing(table)
  }

  private setCellWidth(cell: HTMLTableCellElement, columnDefinition?: ColumnDefinition, tableX?: number) {
    if (!columnDefinition) {
      return
    }

    if (
      columnDefinition.columnWidthBehavior === ColumnWidthBehavior.UseSpecifiedWidth &&
      columnDefinition.width !== undefined
    ) {
      const width = columnDefinition.width
      const suffix = this.getUnitOfMeasureSuffix(columnDefinition.widthUnitOfMeasure)
      this.setCellWidthValues(cell, width, suffix)
      if (columnDefinition.columnWrapBehavior === ColumnWrapBehavior.NoWrapAndDisplayEllipsis) {
        cell.classList.add('tree-table-cell__td--nowrap')
      }
      if (columnDefinition.columnWrapBehavior === ColumnWrapBehavior.NoWrapAndTruncate) {
        cell.classList.add('tree-table-cell__td--nowrap-truncate')
      }
      if (columnDefinition.columnWrapBehavior === ColumnWrapBehavior.Wrap) {
        cell.classList.add('tree-table-cell__td--wrap')
      }

      return
    }

    if (columnDefinition.columnWidthBehavior === ColumnWidthBehavior.DynamicallySizeToContent) {
      const els = cell.querySelectorAll('span') as any
      for (const el of els) {
        if (el.nodeName === 'SPAN') {
          const rect = el.getBoundingClientRect()
          const tableXValue = tableX || 0
          const width = rect.x - tableXValue + rect.width
          this.setCellWidthValues(cell, width, 'px')
          return
        }
      }
    }
  }

  private setCellWidthValues(cell: HTMLTableCellElement, width: number, suffix: string) {
    cell.style.width = width + suffix
    cell.style.minWidth = width + suffix
    cell.style.maxWidth = width + suffix
  }

  private getUnitOfMeasureSuffix(unitOfMeasure?: UnitOfMeasure) {
    if (!unitOfMeasure) {
      return ''
    }

    if (unitOfMeasure === UnitOfMeasure.Percent) {
      return '%'
    }
    if (unitOfMeasure === UnitOfMeasure.Pixel) {
      return 'px'
    }
    if (unitOfMeasure === UnitOfMeasure.Em) {
      return 'em'
    }
    return ''
  }

  private freezeCell(element: HTMLTableCellElement, leftPosition: string) {
    element.style.left = leftPosition
    element.style.position = 'sticky'
    element.style.backgroundClip = 'padding-box'
  }

  private setElementWidth(element: HTMLTableCellElement, width: string, leftPosition?: string) {
    element.style.width = width
    element.style.minWidth = width
    element.style.maxWidth = width
  }

  private getCurrentLeftPosition(columnIndex: number, widths: Array<string>) {
    let result = 0
    for (let i = 0; i < columnIndex; i++) {
      const widthAndUnitOfMeasureString = this.getWidthAndUnitOfMeasureString(widths[i])
      result += widthAndUnitOfMeasureString.width
    }

    return result
  }

  private setColumnWidth(
    table: HTMLTableElement,
    columnIndex: number,
    widths: Array<string>,
    columnDefinitions: Array<ColumnDefinition>,
  ) {
    const cells = table.querySelectorAll(
      `th[data-column-index='${columnIndex}'], td[data-column-index='${columnIndex}']`,
    )
    const leftPosition = this.getCurrentLeftPosition(columnIndex, widths)
    for (const cell of cells) {
      const tableCell = cell as HTMLTableCellElement
      if (tableCell.colSpan === 1) {
        this.setElementWidth(tableCell, widths[columnIndex])
        const widthAndUnitOfMeasureString = this.getWidthAndUnitOfMeasureString(widths[columnIndex])
        if (columnDefinitions[columnIndex].isFrozen) {
          this.freezeCell(tableCell, leftPosition + widthAndUnitOfMeasureString.unitOfMeasure)
        }
      }
      else {
        const colspan = tableCell.colSpan
        let cellWidth = 0
        let unitOfMeasure = ''

        for (let i = 0; i < tableCell.colSpan; i++) {
          const widthAndUnitOfMeasureString = this.getWidthAndUnitOfMeasureString(widths[columnIndex + i])
          unitOfMeasure = widthAndUnitOfMeasureString.unitOfMeasure
          cellWidth += widthAndUnitOfMeasureString.width
        }

        this.setElementWidth(tableCell, cellWidth + unitOfMeasure)
        // colspan with sticky is not truly sticky so don't make columns with colspan sticky
        //  TODO: make sticky work with colspan
        if (columnDefinitions[columnIndex].isFrozen && tableCell.nodeName === 'TH') {
          this.freezeCell(tableCell, leftPosition + unitOfMeasure)
        }
      }
    }
  }

  private getColumnWidth(
    table: HTMLTableElement,
    tableX: number,
    columnIndex: number,
    columnDefinitions: Array<ColumnDefinition>,
  ) {
    const columnDefinition = columnDefinitions[columnIndex]
    if (columnDefinition.columnWidthBehavior === ColumnWidthBehavior.UseSpecifiedWidth) {
      const unitOfMeasureSuffix = this.getUnitOfMeasureSuffix(columnDefinition.widthUnitOfMeasure)
      return columnDefinition.width! + unitOfMeasureSuffix
    }

    if (columnDefinition.columnWidthBehavior === ColumnWidthBehavior.DynamicallySizeToContent) {
      const columnCells = table.querySelectorAll(
        `td[data-column-index='${columnIndex}'] span.tree-table__rendered-cell`,
      )
      let maxWidth = 0
      for (const columnCell of columnCells) {
        const tableCell = columnCell.parentElement as HTMLTableCellElement
        if (tableCell.colSpan === 1) {
          const cellWidth = this.getWidthOfCell(columnCell, tableX, maxWidth) + 5 // some padding
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth
          }
        }
      }

      const headerCells = table.querySelectorAll(`th[data-column-index='${columnIndex}']`)
      for (const headerCell of headerCells) {
        const header = headerCell as HTMLTableCellElement
        if (!header.colSpan || header.colSpan === 1) {
          // 5 for sorting and 7 padding on each side
          const cellWidth = this.getWidthOfCell(header, tableX, maxWidth) + 5 + 6 + 6
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth
          }
        }
      }

      return maxWidth + 'px'
    }

    return ''
  }

  private getWidthOfCell(cell: Element, tableX: number, maxWidth: number) {
    let columnWidth = 0
    cell.childNodes.forEach((_: any) => {
      if (_.nodeName === 'SPAN') {
        const rect = _.getBoundingClientRect()
        // const width = rect.x - tableX + rect.width
        columnWidth += rect.width
        if (columnWidth > maxWidth) {
          maxWidth = columnWidth
        }
      }
    })

    if (cell.parentElement && cell.parentElement.style && cell.parentElement.style.paddingLeft) {
      const paddingLeft = this.getWidthAndUnitOfMeasureString(cell.parentElement.style.paddingLeft)
      columnWidth += paddingLeft.width
    }

    return columnWidth
  }

  private getWidthAndUnitOfMeasureString(widthString: string) {
    const unitOfMeasure = widthString.slice(widthString.length - 2)
    const width = Number(widthString.slice(0, widthString.length - 2))
    return { width, unitOfMeasure }
  }

  private adjustColumnWidthsForColspan(
    table: HTMLTableElement,
    tableX: number,
    columnIndex: number,
    columnDefinition: ColumnDefinition,
    columnWidths: Array<string>,
  ) {
    if (columnDefinition.columnWidthBehavior !== ColumnWidthBehavior.DynamicallySizeToContent) {
      return
    }

    const columnCells = table.querySelectorAll(`td[data-column-index='${columnIndex}'] span.tree-table__rendered-cell`)

    for (const columnCell of columnCells) {
      const tableCell = columnCell.parentElement as HTMLTableCellElement
      if (tableCell.colSpan > 1) {
        const cellWidth = this.getWidthOfCell(columnCell, tableX, 0)
        const endingColumnIndex = columnIndex + tableCell.colSpan - 1

        const colspanWidth = columnWidths
          .filter((_, index) => index >= columnIndex && index <= endingColumnIndex)
          .map(_ => this.getWidthAndUnitOfMeasureString(_).width)
          .reduce((totalWidth, width) => (totalWidth += width))

        // If the cellWidth with a colspan is bigger than the area spanned then adjust other column widths.
        if (cellWidth > colspanWidth) {
          const startingColumnIndex = columnIndex
          const additionalWidth = cellWidth - colspanWidth
          const numberOfColumns = endingColumnIndex - startingColumnIndex + 1
          const additionalWidthPerColumn = additionalWidth / numberOfColumns

          for (let i = startingColumnIndex; i <= endingColumnIndex; i++) {
            const widthAndMeasure = this.getWidthAndUnitOfMeasureString(columnWidths[i])
            columnWidths[i] = widthAndMeasure.width + additionalWidthPerColumn + widthAndMeasure.unitOfMeasure
          }
        }
      }
    }
  }

  private adjustTreeTableSizing(table: HTMLTableElement | null, defaultFirstColumnWidth = 0) {
    if (!table) {
      return
    }

    const tableDOMRect = table.getBoundingClientRect() as DOMRect
    const tableX = tableDOMRect.x

    // const scrollBarWidth = new ScrollBarDimension().width
    const columnWidths = []
    for (let columnIndex = 0; columnIndex < this.columnDefinitions.length; columnIndex++) {
      columnWidths.push(this.getColumnWidth(table, tableX, columnIndex, this.columnDefinitions))
    }

    for (let columnIndex = 0; columnIndex < columnWidths.length; columnIndex++) {
      this.adjustColumnWidthsForColspan(table, tableX, columnIndex, this.columnDefinitions[columnIndex], columnWidths)
    }

    for (let columnIndex = 0; columnIndex < this.columnDefinitions.length; columnIndex++) {
      this.setColumnWidth(table, columnIndex, columnWidths, this.columnDefinitions)
      // if (columnIndex < 3) {
      //     const widthAndUnitOfMeasureString = this.getWidthAndUnitOfMeasureString(widths[columnIndex])
      //     this.freezeCell(tableCell, leftPosition + widthAndUnitOfMeasureString.unitOfMeasure)
      //     leftPosition += widthAndUnitOfMeasureString.width
      // }
    }

    this.$emit('columns-resized')
  }

  private mounted() {
    if (this.rows && this.rows.length) {
      this.setRowsToDisplay()
    }
  }

  private created() {
    if (!this.id) {
      this.uniqueId = Guid.newGuid()
    }
    else {
      this.uniqueId = this.id
    }
    if (this.treeTableSorter) {
      this.treeTableSorterImpl = this.treeTableSorter
    }
  }
}
// tslint:disable-next-line:max-line-length
// https://stackoverflow.com/questions/41882616/why-border-is-not-visible-with-position-sticky-when-background-color-exists
</script>
<style>
.tree-table-cell__td.font-weight__bold {
  font-weight: 500;
}
.tree-table-cell__td.font-style__italic {
  font-style: italic;
}
.tree-table-cell__td.text-decoration__underline {
  text-decoration: underline;
}
.tree-table-cell__td.text-align__left {
  text-align: left;
}
.tree-table-cell__td.text-align__right {
  text-align: right;
}
.tree-table-cell__td.text-align__center {
  text-align: center;
}
.tree-table-cell__td--nowrap-truncate {
  white-space: nowrap;
  overflow:    hidden;
}
.tree-table-cell__td--nowrap {
  white-space:   nowrap;
  overflow:      hidden;
  text-overflow: ellipsis;
}
.tree-table-cell__td--wrap {
  white-space: initial;
}
div.tree-table-v2__div--box .fixed-column {
  text-align: unset;
}
.tree-table-cell__td--clickable {
  cursor: pointer;
}
div.tree-table-v2__div--box table.scrolling tr {
  text-align: left;
}
div.tree-table-v2__div--box table.scrolling {
  border-collapse: separate;
  border-spacing:  0;
}
/* TODO: fix this so that we don't get double lines*/
div.tree-table-v2__div--box table.scrolling tr.tree-table-cell__tr--subheader {
  /* margin: -1px 0; */
  border-bottom: 1px solid #555555 !important;
  border-top:    1px solid #555555 !important;
}
div.tree-table-v2__div--box table.scrolling td.tree-table-cell__td--subheader {
  background-color: #f8f8f8 !important;
  /* border-bottom: 1px solid #555555 !important;
  border-top: 1px solid #555555 !important;
  font-weight: 500; */
  padding-left:     0.4em;
  height:           33px;
  vertical-align:   middle;
}
div.tree-table-v2__div--box table.scrolling tr td.tree-table-cell__td--focused-metric {
  background-color: rgb(235, 248, 240) !important;
}
div.tree-table-v2__div--box table.scrolling tr.tree-table-cell__td--data-row:hover td {
  background-color: rgb(235, 248, 240) !important;
}
div.tree-table-v2__div--box table.scrolling td i.material-icons {
  vertical-align: bottom;
}
div.tree-table-v2__div--box table.scrolling td,
div.tree-table-v2__div--box table.scrolling th {
  /* border: 1px solid #ddd !important; */
  font-size: small;
}
.tree-table__border-top--on {
  border-top: 1px solid #ddd !important;
}
div.tree-table-v2__div--box table.scrolling td {
  height:         31px;
  vertical-align: middle;
}
div.tree-table-v2__div--box table.scrolling thead.scrollsync {
  background-color: white !important;
  /* overflow-y: auto !important; Pushes header over scrollbar which causes misalignment of header and body when scroll bar is visible at the far right */
}
div.tree-table-v2__div--box table.scrolling thead {
  --tree-table__cell--background-color: #16a5c6;
}
div.tree-table-v2__div--box table.scrolling thead th {
  border:           0px;
  background-color: var(--tree-table__cell--background-color) !important;
  color:            #ffffff;
  text-align:       center;
  height:           32px;
  font-weight:      500;
  white-space:      nowrap;
}
div.tree-table-v2__div--box table.scrolling td.cell__value--raw.tree-table-cell__td--subheader {
  border-left: 0 !important;
}
div.tree-table-v2__div--box table.scrolling tr.cell__value--grid-line {
  border-bottom: 1px solid #ddd !important;
}
div.tree-table-v2__div--box table.scrolling td.cell__value--raw {
  width:         13em;
  max-width:     13em;
  min-width:     13em;
  text-align:    right;
  padding-right: 6px;
  padding-left:  4px;
  border-left:   1px solid #ddd !important;
}
div.tree-table-v2__div--box table.scrolling td.cell__value--common {
  width:         7em;
  max-width:     7em;
  min-width:     7em;
  padding-left:  12px;
  padding-right: 6px;
  border-left:   0 !important;
  text-align:    center;
}
div.tree-table-v2__div--box table.scrolling td {
  border:        0px;
  white-space:   nowrap !important;
  border-left:   1px solid #dddddd;
  border-right:  0;
  border-top:    0;
  border-bottom: 0;
}
div.tree-table-v2__div--box table.scrolling .column__width--20em {
  width:     20em;
  min-width: 20em;
  max-width: 20em;
}
div.tree-table-v2__div--box table.scrolling tfoot tr th {
  width:     130em;
  min-width: 130em;
  max-width: 130em;
}
div.tree-table-v2__div--box table.freezeFirstColumn thead tr:first-child {
  border-top: 0 !important;
}
div.tree-table-v2__div--box table.freezeFirstColumn tfoot tr:first-child {
  border-top: 0 !important;
}
div.tree-table-v2__div--box table.scrolling thead tr,
div.tree-table-v2__div--box table.scrolling tbody tr,
div.tree-table-v2__div--box table.scrolling tfoot tr {
  display: block;
  width:   min-content;
}
/* div.tree-table-v2__div--box table.freezeFirstColumn thead td:first-child,
div.tree-table-v2__div--box table.freezeFirstColumn tbody td:first-child,
div.tree-table-v2__div--box table.freezeFirstColumn thead th:first-child,
div.tree-table-v2__div--box table.freezeFirstColumn tfoot td:first-child,
div.tree-table-v2__div--box table.freezeFirstColumn tbody th:first-child {
  position: sticky;
  position: -webkit-sticky;
  left: 0;
  /* Need so that firefox will render border */
/*  background-clip: padding-box;
} */

div.tree-table-v2__div--box table.scrolling {
  background-color: white !important;
  height:           100% !important;
}
.tree-table-v2__div--box {
  clear:        both;
  padding:      0;
  margin-left:  auto;
  margin-right: auto;
  overflow:     hidden;
}
div.tree-table-v2__div--box table.scrolling.scrollx tbody {
  overflow-x: auto !important;
}
div.tree-table-v2__div--box table.scrolling.scrollx tbody::-webkit-scrollbar {
  height: 9px;
}
div.tree-table-v2__div--box table.scrolling.scrolly tbody {
  overflow-y: auto !important;
}

td.tree-table-cell__selected-metric--left {
  -webkit-box-shadow: inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow:    inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow:         inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
}
td.tree-table-cell__selected-metric--right {
  -webkit-box-shadow: inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow:    inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow:         inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  /* padding: 0px !important; */
}
td.tree-table-cell__selected-metric--interior {
  -webkit-box-shadow: inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow:    inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow:         inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  /* padding: 0px !important; */
}
td.tree-table-cell__selected-metric {
  cursor: default;
}
/* Defined on the server side */
div.tree-table-v2__div--box .tree-table-cell__td {
  padding-left:  4px;
  padding-right: 4px;
}
/* div.tree-table-v2__div--box .tree-table-cell__th {
  margin-left: 8px;
  margin-right: 8px;
}
*/
.tree-table__display--none {
  display: none;
}
div.tree-table-v2__div--box table.cell-border td,
div.tree-table-v2__div--box table.cell-border th {
  border: 1px solid #ddd !important;
}
div.tree-table-v2__div--box table.cell-border td:first-child,
div.tree-table-v2__div--box table.cell-border th:first-child {
  /* border-left: 0!important; */
}
div.tree-table-v2__div--box table.cell-border td:last-child,
div.tree-table-v2__div--box table.cell-border th:last-child {
  /* border-right: 0!important; */
}
div.tree-table-v2__div--box table.cell-border thead tr td,
div.tree-table-v2__div--box table.cell-border thead tr th {
  border-top: 0 !important;
}
div.tree-table-v2__div--box table.cell-border tfoot tr td,
div.tree-table-v2__div--box table.cell-border tfoot tr th {
  border-top: 0 !important;
}
div.tree-table-v2__div--box table.cell-border tr:first-child td,
div.tree-table-v2__div--box table.cell-border tr:first-child th {
  border-top: 0 !important;
}
div.tree-table-v2__div--box table.cell-border tfoot tr:first-child td,
div.tree-table-v2__div--box table.cell-border tfoot tr:first-child th {
  border: 1px solid #ddd !important;
}
div.tree-table-v2__div--box table.navigation-report {
  margin-top: 30px;
}
div.tree-table-v2__div--box table.navigation-report td {
  font-size: 17px !important;
  border:    0 !important;
}
div.tree-table-v2__div--box table.navigation-report th {
  font-size: 18px !important;
  border:    0 !important;
}
div.tree-table-v2__div--box table.navigation-report td.tree-table-cell__td--clickable {
  text-decoration: underline;
  color:           blue !important; /* use default color for link */
}
div.tree-table-v2__div--box table.cell-border td {
  text-align: center;
}
div.tree-table-v2__div--box table.cell-border td:first-child {
  text-align: left;
}
/* Reserve space for scrollbar in footer but make the scrollbar transparent so it doesn't render */
div.tree-table-v2__div--box table.scrolling tfoot.scrollsync {
  overflow-y: scroll;
}
div.tree-table-v2__div--box table.scrolling tfoot.scrollsync::-webkit-scrollbar {
  background-color: transparent;
}
div.tree-table-v2__div--box table.scrolling tfoot.scrollsync::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
