<template>
  <div
    class="tree-table__div--box"
    :style="cssStyleValue"
  >
    <vue-scrolling-table
      :scroll-horizontal="shouldScrollHorizontalValue"
      :scroll-vertical="shouldScrollVerticalValue"
      :sync-header-scroll="shouldSyncHeaderScrollValue"
      :sync-footer-scroll="shouldSyncFooterScrollValue"
      :include-footer="shouldIncludeFooterValue"
      :dead-area-color="deadAreaColorValue"
      :class="{ freezeFirstColumn: shouldFreezeFirstColumnValue }"
    >
      <template slot="thead">
        <tr
          v-for="headerRow in headersToDisplay"
          :class="headerRow.cssClasses"
          :key="headerRow.id"
        >
          <th
            v-for="header in headerRow.items"
            :class="header.cssClasses"
            :key="header.id"
            :colspan="header.colspan"
          >
            <component
              :is="header.renderer || 'DefaultHeaderCellRenderer'"
              :header="header"
              @toggle-sort="toggleSort($event)"
            ></component>
          </th>
        </tr>
      </template>
      <template slot="tbody">
        <row-renderer
          v-for="row in rowsToDisplay"
          :key="row.id"
          :row="row"
        ></row-renderer>
      </template>
    </vue-scrolling-table>
  </div>
</template>

<script <script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import VueScrollingTable from 'vue-scrolling-table'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { ColumnSorter } from './ColumnSorter'
import DefaultHeaderCellRenderer from './DefaultHeaderCellRenderer.vue'
import RowRenderer from './RowRenderer.vue'
import { SortDirection } from './SortDirection'
import { TreeTableHeaderItem } from './TreeTableHeaderItem'
import { TreeTableHeaderRow } from './TreeTableHeaderRow'
import { TreeTableItem } from './TreeTableItem'
import { makeTreeTableItemPropertyCompare } from './TreeTableItemComparerFactory'
import { TreeTableRow } from './TreeTableRow'

@Component({
  components: { DefaultHeaderCellRenderer, RowRenderer, VueScrollingTable },
})
export default class TreeTable extends ComponentBase {
  @Prop({ type: Array, required: true })
  private headers: Array<TreeTableHeaderRow>

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

  @Prop({ type: Boolean, required: false, default: true })
  private shouldFreezeFirstColumn: boolean

  @Prop({ type: String, required: false, default: '#FFFFFF' })
  private deadAreaColor: string

  @Prop({ type: Number, required: false, default: 100000 })
  private maxRows: number

  @Prop({ type: String, required: false, default: '' })
  private cssStyle: string

  @Prop({ type: Function, required: false })
  private treeTableSorter?: (rows: Array<TreeTableRow>, headers: Array<TreeTableHeaderRow>) => Array<TreeTableRow>

  private treeTableSorterImpl: (
    rows: Array<TreeTableRow>,
    headers: Array<TreeTableHeaderRow>,
  ) => Array<TreeTableRow> = this.defaultTreeTableSorter

  private rowsToDisplay: Array<TreeTableRow> = []

  private get cssStyleValue() {
    return this.cssStyle
  }

  private get headersToDisplay() {
    return this.headers
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
  private get shouldFreezeFirstColumnValue() {
    return this.shouldFreezeFirstColumn
  }

  @Watch('rows')
  private rowsWatcher(val: Array<TreeTableRow>, oldVal: Array<TreeTableRow>) {
    this.rows = val
    this.setRowsToDisplay()
  }

  private toggleSort(header: TreeTableHeaderItem) {
    if (header.columnSorter) {
      let newSortDirection = SortDirection.Ascending
      if (header.columnSorter.sortDirection === undefined || header.columnSorter.sortDirection === SortDirection.None) {
        newSortDirection = SortDirection.Ascending
      } else if (
        header.columnSorter.sortDirection === SortDirection.Ascending ||
        header.columnSorter.sortDirection === SortDirection.Descending
      ) {
        newSortDirection = header.columnSorter.sortDirection * -1
      } else {
        throw new Error('Unsupported SortDirection: ' + header.columnSorter.sortDirection)
      }
      this.headers.forEach(_ =>
        _.items.forEach(col => (col.columnSorter ? (col.columnSorter.sortDirection = SortDirection.None) : undefined)),
      )
      header.columnSorter.sortDirection = newSortDirection
      this.setRowsToDisplay()
    }
  }

  private toggleExpanded(row?: TreeTableRow) {
    if (row) {
      const isRowExanded = !row.isExpanded
      if (row.children) {
        row.children.forEach((childRow: any) => {
          // Set to visible
          childRow.isVisible = isRowExanded
          console.log(childRow.id)
        })
      }
      row.isExpanded = isRowExanded
    }
  }

  private defaultTreeTableSorter(rows: Array<TreeTableRow>, headers: Array<TreeTableHeaderRow>) {
    const sortHeader = headers.flatMap(_ => _.items).filter(_ => _.columnSorter && _.columnSorter.sortDirection)
    if (sortHeader.length > 0) {
      return rows.sort(
        makeTreeTableItemPropertyCompare(
          sortHeader[0].columnSorter!.sortByCellId,
          sortHeader[0].columnSorter!.sortDirection,
          sortHeader[0].columnSorter!.sortComparisonStrategy,
        ),
      )
    }
    return rows
  }

  private async setRowsToDisplay() {
    const rows = this.rows.slice(0, this.maxRows).filter(row => row.isVisible)
    this.rowsToDisplay = this.treeTableSorterImpl(rows, this.headers)
    const tableBody = document.querySelector('table.scrolling tbody') as { scrollTop: number }
    if (tableBody) {
      const scrollTop = tableBody.scrollTop
      await this.$nextTick()
      tableBody.scrollTop = scrollTop
    }
  }

  private created() {
    if (this.treeTableSorter) {
      this.treeTableSorterImpl = this.treeTableSorter
    }
  }
}
// tslint:disable-next-line:max-line-length
// https://stackoverflow.com/questions/41882616/why-border-is-not-visible-with-position-sticky-when-background-color-exists
</script>
<style>
.fixed-column {
  text-align: unset;
}
.tree-table-item__td--clickable {
  cursor: pointer;
}
table.scrolling tr {
  text-align: left;
}
/* TODO: fix this so that we don't get double lines*/
table.scrolling tr.subheader {
  /* margin: -1px 0; */
  border-bottom: 1px solid #555555 !important;
  border-top: 1px solid #555555 !important;
}
table.scrolling td.subheader {
  background-color: #f8f8f8 !important;
  /* border-bottom: 1px solid #555555 !important;
  border-top: 1px solid #555555 !important;
  font-weight: 500; */
  padding-left: 0.4em;
  height: 33px;
  vertical-align: middle;
}
table.scrolling tr td.focused-metric {
  background-color: rgb(235, 248, 240) !important;
}
table.scrolling tr.data-row:hover td {
  background-color: rgb(235, 248, 240) !important;
}
table.scrolling td i.material-icons {
  vertical-align: bottom;
}
table.scrolling td,
table.scrolling th {
  border: 0px solid #ddd !important;
  font-size: small;
}
table.scrolling td {
  height: 31px;
  vertical-align: middle;
}
table.scrolling thead.scrollsync {
  background-color: white !important;
  /* overflow-y: auto !important; Pushes header over scrollbar which causes misalignment of header and body when scroll bar is visible at the far right */
}
table.scrolling thead th {
  border: 0px;
  background-color: #16a5c6 !important;
  color: #ffffff;
  text-align: center;
  height: 32px;
  font-weight: 500;
}
table.scrolling td.cell--value--raw.subheader {
  border-left: 0 !important;
}
table.scrolling tr.cell--value--grid-line {
  border-bottom: 1px solid #ddd !important;
}
table.scrolling td.cell--value--grid-line {
  /* border-bottom: 1px solid #ddd!important; */
}
table.scrolling td.cell--value--raw {
  width: 13em;
  max-width: 13em;
  min-width: 13em;
  text-align: right;
  padding-right: 6px;
  padding-left: 4px;
  border-left: 1px solid #ddd !important;
}
table.scrolling td.cell--value--common {
  width: 7em;
  max-width: 7em;
  min-width: 7em;
  padding-left: 12px;
  padding-right: 6px;
  border-left: 0 !important;
  text-align: center;
}
table.scrolling td {
  border: 0px;
  white-space: nowrap !important;
  border-left: 1px solid #dddddd;
  border-right: 0;
  border-top: 0;
  border-bottom: 0;
}
table.scrolling .w2 {
  width: 20em;
  min-width: 20em;
  max-width: 20em;
}
table.scrolling tfoot tr th {
  width: 130em;
  min-width: 130em;
  max-width: 130em;
}
table.freezeFirstColumn thead tr,
table.freezeFirstColumn tbody tr {
  display: block;
  width: min-content;
}
table.freezeFirstColumn thead td:first-child,
table.freezeFirstColumn tbody td:first-child,
table.freezeFirstColumn thead th:first-child,
table.freezeFirstColumn tbody th:first-child {
  position: sticky;
  position: -webkit-sticky;
  left: 0;
  /* Need so that firefox will render border */
  background-clip: padding-box;
}

table.scrolling {
  background-color: white !important;
  height: 100% !important;
}
.tree-table__div--box {
  clear: both;
  padding: 0;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
}
table.scrolling.scrollx tbody {
  overflow-x: auto !important;
}
table.scrolling.scrolly tbody {
  overflow-y: auto !important;
}

td.selected-metric-left {
  -webkit-box-shadow: inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow: inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow: inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
}

td.selected-metric-right {
  -webkit-box-shadow: inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow: inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow: inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  /* padding: 0px !important; */
}

td.selected-metric-interior {
  -webkit-box-shadow: inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow: inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow: inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  /* padding: 0px !important; */
}

td.selected-metric {
  cursor: default;
}
</style>
