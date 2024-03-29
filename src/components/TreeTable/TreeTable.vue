<template>
  <div
    :key="idValue"
    :style="cssStyleValue"
    class="tree-table__div--box"
  >
    <vue-scrolling-table
      :class="{ freezeFirstColumn: shouldFreezeFirstColumnValue }"
      :dead-area-color="deadAreaColorValue"
      :include-footer="shouldIncludeFooterValue"
      :scroll-horizontal="shouldScrollHorizontalValue"
      :scroll-vertical="shouldScrollVerticalValue"
      :sync-footer-scroll="shouldSyncFooterScrollValue"
      :sync-header-scroll="shouldSyncHeaderScrollValue"
    >
      <template slot="thead">
        <tr
          v-for="headerRow in theHeaders"
          :key="headerRow.id"
          :class="headerRow.cssClasses"
        >
          <th
            v-for="header in headerRow.cells"
            :key="header.id"
            :class="header.cssClasses"
            :colspan="header.colspan"
            :style="header.cssStyles"
          >
            <component
              :is="header.renderer || 'HeaderCellRenderer'"
              :key="header.columnSorter ? header.columnSorter.sortDirection : 0"
              :header="header"
              @toggle-sort="toggleSort($event)"
            ></component>
          </th>
        </tr>
      </template>
      <template
        v-if="shouldUseFunctionalRenderers"
        slot="tbody"
      >
        <functional-row-renderer
          v-for="row in rowsToDisplay"
          :key="row.id"
          :row="row"
        ></functional-row-renderer>
      </template>
      <template
        v-else
        slot="tbody"
      >
        <row-renderer
          v-for="row in rowsToDisplay"
          :key="row.id"
          :row="row"
        ></row-renderer>
      </template>
    </vue-scrolling-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import VueScrollingTable from 'vue-scrolling-table'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

// import FixedCellRenderer from './FixedCellRenderer.vue'
// import HeaderCellRenderer from './HeaderCellRenderer.vue'
// import TextCellRenderer from './TextCellRenderer.vue'
//
// Vue.component(FixedCellRenderer.name, FixedCellRenderer)
// Vue.component(HeaderCellRenderer.name, HeaderCellRenderer)
// Vue.component(TextCellRenderer.name, TextCellRenderer)
import {
  getSortedHeaderCellWithIndex,
  Guid,
  makeTreeTableCellPropertyCompare,
  SortDirection,
  TreeTableHeaderCell,
  TreeTableHeaderRow,
  TreeTableRow,
} from '@vuescape/index'

import FunctionalRowRenderer from './functional-renderers/RowRenderer.vue'
import RowRenderer from './RowRenderer.vue'

@Component({
  components: {
    FunctionalRowRenderer,
    RowRenderer,
    VueScrollingTable,
  },
})
export default class TreeTable extends ComponentBase {
  private idValue: string
  private headerId = Guid.newGuid()
  private rowRendererValue: any
  private headersValue: Array<TreeTableHeaderRow>

  @Prop({
    type    : String,
    required: false,
  }) private id: string

  @Prop({
    type    : Array,
    required: true,
  }) private headers: Array<TreeTableHeaderRow>

  @Prop({
    type    : Array,
    required: true,
  }) private rows: Array<TreeTableRow>

  @Prop({
    type    : Boolean,
    required: false,
    default : true,
  }) private shouldScrollVertical: boolean

  @Prop({
    type    : Boolean,
    required: false,
    default : true,
  }) private shouldScrollHorizontal: boolean

  @Prop({
    type    : Boolean,
    required: false,
    default : true,
  }) private shouldSyncHeaderScroll: boolean

  @Prop({
    type    : Boolean,
    required: false,
    default : true,
  }) private shouldSyncFooterScroll: boolean

  @Prop({
    type    : Boolean,
    required: false,
    default : false,
  }) private shouldIncludeFooter: boolean

  @Prop({
    type    : Boolean,
    required: false,
    default : true,
  }) private shouldFreezeFirstColumn: boolean

  @Prop({
    type    : String,
    required: false,
    default : '#ffffff',
  }) private deadAreaColor: string

  @Prop({
    type    : Number,
    required: false,
    default : 100000,
  }) private maxRows: number

  @Prop({
    type    : String,
    required: false,
    default : '',
  }) private cssStyle: string

  @Prop({
    type    : Function,
    required: false,
  }) private treeTableSorter?: (rows: Array<TreeTableRow>, headers: Array<TreeTableHeaderRow>) => Array<TreeTableRow>

  @Prop({
    type    : Function,
    required: false,
  }) private postUpdateCallback?: () => void

  @Prop({
    type   : Boolean,
    default: false,
  }) private shouldUseFunctionalRenderers: boolean

  private treeTableSorterImpl: (rows: Array<TreeTableRow>,
    headers: Array<TreeTableHeaderRow>,
  ) => Array<TreeTableRow> = this.defaultTreeTableSorter

  private rowsToDisplay: Array<TreeTableRow> = []

  private get cssStyleValue() {
    return this.cssStyle
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

  @Watch('id')
  private idWatcher(val: string, oldVal: string) {
    this.idValue = val
  }

  private get theHeaders() {
    if (this.headerId) {
      return this.headersValue
    }
  }

  @Watch('rows')
  private rowsWatcher(val: Array<TreeTableRow>, oldVal: Array<TreeTableRow>) {
    this.rows = val
    this.setRowsToDisplay()
  }

  @Watch('headers')
  private headersWatcher(val: Array<TreeTableHeaderRow>, oldVal: Array<TreeTableHeaderRow>) {
    this.headersValue = val
    this.headerId     = Guid.newGuid()
  }

  private toggleSort(header: TreeTableHeaderCell) {
    if (header.columnSorter) {
      let newSortDirection = SortDirection.Ascending
      if (header.columnSorter.sortDirection === undefined || header.columnSorter.sortDirection === SortDirection.None) {
        newSortDirection = SortDirection.Ascending
      }
      else if (header.columnSorter.sortDirection === SortDirection.Ascending || header.columnSorter.sortDirection === SortDirection.Descending) {
        newSortDirection = header.columnSorter.sortDirection * -1
      }
      else {
        throw new Error('Unsupported SortDirection: ' + header.columnSorter.sortDirection)
      }
      this.headersValue.forEach(_ => _.cells.forEach(col => (col.columnSorter ?
        (col.columnSorter.sortDirection = SortDirection.None) : undefined)))
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
    const sortHeader = getSortedHeaderCellWithIndex(headers)
    if (sortHeader) {
      return rows.sort(makeTreeTableCellPropertyCompare(sortHeader.index,
        sortHeader.cell.columnSorter!.sortDirection,
        sortHeader.cell.columnSorter!.sortComparisonStrategy,
      ))
    }

    return rows
  }

  private async setRowsToDisplay() {
    const rows         = this.rows.slice(0, this.maxRows).filter(row => row.isVisible)
    this.rowsToDisplay = this.treeTableSorterImpl(rows, this.headersValue)
    const tableBody    = document.querySelector('table.scrolling tbody') as { scrollTop: number }
    if (tableBody) {
      const scrollTop = tableBody.scrollTop
      await this.$nextTick()
      tableBody.scrollTop = scrollTop
    }
  }

  private created() {
    this.idValue      = this.id ? this.id : Guid.newGuid()
    this.headersValue = this.headers

    if (this.treeTableSorter) {
      this.treeTableSorterImpl = this.treeTableSorter
    }
    if (this.rows && this.rows.length) {
      this.setRowsToDisplay()
    }
  }
}
// tslint:disable-next-line:max-line-length
// https://stackoverflow.com/questions/41882616/why-border-is-not-visible-with-position-sticky-when-background-color-exists
</script>
<style>
div.tree-table__div--box table.scrolling {
  border-collapse: separate;
  border-spacing:  0;
}
div.tree-table__div--box .fixed-column {
  text-align: unset;
}
div.tree-table__div--box .tree-table-item__td--clickable {
  cursor: pointer;
}
div.tree-table__div--box table.scrolling tr {
  text-align: left;
}
/* TODO: fix this so that we don't get double lines*/
div.tree-table__div--box table.scrolling tr.subheader {
  /* margin: -1px 0; */
  border-bottom: 1px solid #555555 !important;
  border-top:    1px solid #555555 !important;
}
div.tree-table__div--box table.scrolling td.subheader {
  background-color: #f8f8f8 !important;
  /* border-bottom: 1px solid #555555 !important;
  border-top: 1px solid #555555 !important;
  font-weight: 500; */
  padding-left:     0.4em;
  height:           33px;
  vertical-align:   middle;
}
div.tree-table__div--box table.scrolling tr td.focused-metric {
  background-color: rgb(235, 248, 240) !important;
}
div.tree-table__div--box table.scrolling tr.data-row:hover td {
  background-color: rgb(235, 248, 240) !important;
}
div.tree-table__div--box table.scrolling td i.material-icons {
  vertical-align: bottom;
}
div.tree-table__div--box table.scrolling td,
div.tree-table__div--box table.scrolling th {
  border:    0px solid #ddd !important;
  font-size: small;
}
div.tree-table__div--box table.scrolling td {
  height:         31px;
  vertical-align: middle;
}
div.tree-table__div--box table.scrolling thead.scrollsync {
  background-color: white !important;
  /* overflow-y: auto !important; Pushes header over scrollbar which causes misalignment of header and body when scroll bar is visible at the far right */
}
div.tree-table__div--box table.scrolling thead th {
  border:           0px;
  background-color: #16a5c6 !important;
  color:            #ffffff;
  text-align:       center;
  height:           32px;
  font-weight:      500;
}
div.tree-table__div--box table.scrolling td.cell--value--raw.subheader {
  border-left: 0 !important;
}
div.tree-table__div--box table.scrolling tr.cell--value--grid-line {
  border-bottom: 1px solid #ddd !important;
}
div.tree-table__div--box table.scrolling td.cell--value--grid-line {
  /* border-bottom: 1px solid #ddd!important; */
}
div.tree-table__div--box table.scrolling td.cell--value--raw {
  width:         13em;
  max-width:     13em;
  min-width:     13em;
  text-align:    right;
  padding-right: 6px;
  padding-left:  4px;
  border-left:   1px solid #ddd !important;
}
div.tree-table__div--box table.scrolling td.cell--value--common {
  width:         7em;
  max-width:     7em;
  min-width:     7em;
  padding-left:  12px;
  padding-right: 6px;
  border-left:   0 !important;
  text-align:    center;
}
div.tree-table__div--box table.scrolling td {
  border:        0px;
  white-space:   nowrap !important;
  border-left:   1px solid #dddddd;
  border-right:  0;
  border-top:    0;
  border-bottom: 0;
}
div.tree-table__div--box table.scrolling .w2 {
  width:     20em;
  min-width: 20em;
  max-width: 20em;
}
div.tree-table__div--box table.scrolling tfoot tr th {
  width:     130em;
  min-width: 130em;
  max-width: 130em;
}
div.tree-table__div--box table.freezeFirstColumn thead tr,
div.tree-table__div--box table.freezeFirstColumn tbody tr {
  display: block;
  width:   min-content;
}
div.tree-table__div--box table.freezeFirstColumn thead td:first-child,
div.tree-table__div--box table.freezeFirstColumn tbody td:first-child,
div.tree-table__div--box table.freezeFirstColumn thead th:first-child,
div.tree-table__div--box table.freezeFirstColumn tbody th:first-child {
  position:        sticky;
  position:        -webkit-sticky;
  left:            0;
  /* Need so that firefox will render border */
  background-clip: padding-box;
}

div.tree-table__div--box table.scrolling {
  background-color: white !important;
  height:           100% !important;
}
div.tree-table__div--box .tree-table__div--box {
  clear:        both;
  padding:      0;
  margin-left:  auto;
  margin-right: auto;
  overflow:     hidden;
}
div.tree-table__div--box table.scrolling.scrollx tbody {
  overflow-x: auto !important;
}
div.tree-table__div--box table.scrolling.scrolly tbody {
  overflow-y: auto !important;
}

div.tree-table__div--box td.selected-metric-left {
  -webkit-box-shadow: inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow:    inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow:         inset 3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
}

div.tree-table__div--box td.selected-metric-right {
  -webkit-box-shadow: inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow:    inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow:         inset -3px 0 0px 0px #666, inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  /* padding: 0px !important; */
}

div.tree-table__div--box td.selected-metric-interior {
  -webkit-box-shadow: inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  -moz-box-shadow:    inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  box-shadow:         inset 0 3px 0 0 #666, inset 0 -3px 0 0 #666;
  /* padding: 0px !important; */
}

div.tree-table__div--box td.selected-metric {
  cursor: default;
}
</style>
