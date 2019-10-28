<template>
  <div class='box'>
    <vue-scrolling-table
      :scroll-horizontal='scrollHorizontal'
      :scroll-vertical='scrollVertical'
      :sync-header-scroll='syncHeaderScroll'
      :sync-footer-scroll='syncFooterScroll'
      :include-footer='includeFooter'
      :dead-area-color='deadAreaColor'
      :class='{ freezeFirstColumn:freezeFirstColumn }'
    >
      <template slot='thead'>
        <tr>
          <th
            v-for='header in headersToDisplay'
            :style="header.id === 'id' ? '{ min-width: 400px; }' : '{}'"
            :class='header.cssClasses'
            :key='header.id'
            :colspan='header.colspan'
          >{{ header.text }}</th>
        </tr>
      </template>
      <template slot='tbody'>
        <row-renderer
          v-for='row in rowsToDisplay'
          :key="row.id"
          :row="row"
        ></row-renderer>
      </template>
    </vue-scrolling-table>
  </div>
</template>

<script <script lang='ts'>
import VueScrollingTable from 'vue-scrolling-table'

import { Component, Prop, Watch } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import RowRenderer from './RowRenderer.vue'
import { TreeTableHeaderRow } from './TreeTableHeaderRow'
import { TreeTableItem } from './TreeTableItem'
import { TreeTableRow } from './TreeTableRow'

@Component({
  components: { RowRenderer, VueScrollingTable },
})
export default class TreeTableTest extends ComponentBase {
  @Prop({ type: Array, required: true })
  private headers: Array<TreeTableHeaderRow>

  @Prop({ type: Array, required: true })
  private rows: Array<TreeTableRow>

  @Prop({ type: Boolean, required: false, default: true })
  private scrollVertical: boolean
  @Prop({ type: Boolean, required: false, default: true })
  private scrollHorizontal = true
  @Prop({ type: Boolean, required: false, default: true })
  private syncHeaderScroll = true
  @Prop({ type: Boolean, required: false, default: true })
  private syncFooterScroll = true
  @Prop({ type: Boolean, required: false, default: false })
  private includeFooter = false
  @Prop({ type: String, required: false, default: '#DDDDDD' })
  private deadAreaColor: string
  @Prop({ type: Boolean, required: false, default: true })
  private freezeFirstColumn: boolean
  @Prop({ type: Number, required: false, default: 100000 })
  private maxRows: number

  public async setSize(maxWidth = 240) {
    const els = document.getElementsByClassName('fixed-column') as any
    for (let i = 0; i < els.length; i++) {
      i++
      i--
      els[i].style.width = els[i].style.minWidth = '100%'
    }

    for (let i = 0; i < els.length; i++) {
      i++
      i--
      const width = els[i].getBoundingClientRect().width
      if (width > maxWidth) {
        maxWidth = width
      }
    }

    for (let i = 0; i < els.length; i++) {
      i++
      i--
      els[i].style.minWidth = maxWidth + 'px'
    }
  }

  @Watch('rows')
  private rowsWatcher(val: Array<TreeTableRow>, oldVal: Array<TreeTableRow>) {
    this.rows = val
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

  private get headersToDisplay() {
    return this.headers
  }

  private get rowsToDisplay() {
    return this.rows.slice(0, this.maxRows).filter(row => row.isVisible)
  }

  private async mounted() {
    await this.setSize()
    await this.$nextTick()
  }
}
</script>

<style>
.fixed-column {
  text-align: unset;
}
.tree-table-item--clickable {
  cursor: pointer;
}
table.scrolling tr {
  text-align: left;
}
table.scrolling td.subheader {
  background-color: #f2f2f2 !important;
  border-bottom: 1px solid #555555;
  border-top: 1px solid #555555;
  font-weight: bold;
  padding-left: 0.4em;
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
}
table.scrolling thead th {
  border: 0px;
  background-color: #0092bc !important;
  color: #ffffff;
  text-align: center;
}
table.scrolling td.cell--value--raw {
  text-align: right;
  padding-right: 5px;
  border-left: 1px solid #ddd !important;
  width: 10%;
}
table.scrolling td.cell--value--common {
  padding-left: 10px;
  border-left: 0 !important;
  width: 6%;
  /* text-align: center */
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
}

/* * {
  font-family: sans-serif;
} */
.box {
  clear: both;
  padding: 0;
  min-height: 300px;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
}
/* @font-face {
	font-family: FontAwesome;
	src: url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff);
}
.fa {
	font-family: FontAwesome;
} */

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

table.scrolling td.very-positive {
  background-color: #6ed071;
  color: darkgreen;
}

table.scrolling td.positive {
  background-color: #b7eebc;
  color: darkgreen;
}

table.scrolling td.neutral {
  background-color: #fff2e5;
}

table.scrolling td.negative {
  background-color: #ffbbc0;
  color: darkred;
}

table.scrolling td.very-negative {
  background-color: #fb7072;
  color: darkred;
}
</style>