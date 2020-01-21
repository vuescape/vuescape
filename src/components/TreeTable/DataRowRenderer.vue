<template>
  <div>
    <tr
      :class="rowToDisplay.cssClasses"
      :key='rowToDisplay.id'
    >
      <td
        v-for="(cell, index) in rowToDisplay.items"
        :style="getIndentStyle(rowToDisplay.depth, index, cell)"
        class="cell--border"
        :class="[getCellClasses(cell, rowToDisplay, index), cell.cssClasses]"
        :key='cell.id'
        :colspan='cell.colspan'
        @click="cell.onclick && cell.onclick(rowToDisplay, cell)"
      >
        <span v-if="index === 0 && rowToDisplay.isExpandable">
          <i
            v-if="rowToDisplay.isExpanded"
            class="material-icons"
          >expand_less</i>
          <i
            v-if="!rowToDisplay.isExpanded"
            class="material-icons"
          >chevron_right</i>
          <cell-renderer
            :key="rowToDisplay.id"
            :cell="cell"
          ></cell-renderer>
        </span>
        <span v-else>
          <cell-renderer
            :key="rowToDisplay.id"
            :cell="cell"
          ></cell-renderer>
        </span>
      </td>
    </tr>
  </div>
</template>

<script <script lang='ts'>
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import TreeTable from '.'
import { TreeTableHeaderRow } from './TreeTableHeaderRow'
import { TreeTableItem } from './TreeTableItem'
import { TreeTableRow } from './TreeTableRow'

import CellRenderer from './CellRenderer.vue'

@Component({
  components: { CellRenderer, TreeTable },
})
export default class DataRowRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow

  private get rowToDisplay() {
    return this.row
  }

  private getCellClasses(cell: TreeTableItem, row: TreeTableRow, index: number) {
    const cssClasses = {} as any
    cssClasses['tree-table-item--clickable'] =
      index === 0
        ? row.isExpandable && typeof cell.onclick === typeof Function
        : typeof cell.onclick === typeof Function
    cssClasses['selected-metric'] = row.isSelected
    cssClasses['selected-metric-left'] = row.isSelected && index === 0
    cssClasses['selected-metric-interior'] = row.isSelected && (index !== 0 && index !== row.items.length - 1)
    cssClasses['selected-metric-right'] = row.isSelected && index === row.items.length - 1
    return cssClasses
  }

  private getIndentStyle(depth: number, index: number, cell: any) {
    const indentation = index === 0 ? { 'padding-left': `${++depth * 2}em` } : '{}'
    return indentation
  }
}
</script>

<style scoped>
.material-icons {
  margin-left: -7px;
}
</style>

