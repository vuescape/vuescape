<template>
  <tr
    :class="rowToDisplay.cssClasses"
    :key="rowToDisplay.id"
  >
    <td
      @mouseleave="onMouseLeave(cell)"
      @mouseover="onMouseEnter(cell)"
      v-for="(cell, index) in rowToDisplay.cells.filter(_ => _.isVisible !== false)"
      :style="getIndentStyle(rowToDisplay.depth, index, cell)"
      class="cell--border"
      :class="[getCellClasses(cell, rowToDisplay, index), cell.cssClasses]"
      :key="cell.id"
      :colspan="cell.colspan"
      @click="cell.onclick && cell.onclick(rowToDisplay, cell)"
    >
      <span v-if="index === 0">
        <span v-if="cell.hover && cell.hover.component">
          <!-- style="position: relative;" -->
          <component
            :is="cell.hover.component"
            :cell="cell"
            :row="rowToDisplay"
            :isHovering="isHovering"
          ></component>
          <!-- style="vertical-align: text-top;margin-right: 4px;position: absolute; right: 0;" -->
        </span>
        <span v-if="rowToDisplay.isExpandable">
          <font-awesome-icon
            v-if="rowToDisplay.isExpanded"
            class="data-row-renderer__icon"
            :icon="['fal', 'chevron-down']"
          />
          <font-awesome-icon
            v-else
            class="data-row-renderer__icon"
            :icon="['fal', 'chevron-right']"
          />
        </span>
      </span>
      <span>
        <cell-renderer
          :key="cellKey(cell)"
          :cell="cell"
          :isHovering="cell.hover && isHovering"
        ></cell-renderer>
      </span>
    </td>
  </tr>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { ComponentBase, TreeTableCell, TreeTableRow } from '@vuescape/index'

import CellRenderer from './CellRenderer.vue'

@Component({
  components: { CellRenderer },
})
export default class DataRowRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow

  private isHovering = false

  private get rowToDisplay() {
    return this.row
  }

  private cellKey(cell: TreeTableCell) {
    return cell.id + '_' + (cell.renderer ? cell.renderer.name : 'DefaultCellRenderer')
  }

  private onMouseEnter(cell: TreeTableCell) {
    if (cell.hover) {
      this.isHovering = true
    }
  }
  private onMouseLeave(cell: TreeTableCell) {
    if (cell.hover) {
      this.isHovering = false
    }
  }

  private getCellClasses(cell: TreeTableCell, row: TreeTableRow, index: number) {
    const cssClasses = {} as any
    cssClasses['tree-table-item__td--clickable'] = typeof cell.onclick === typeof Function
    cssClasses['selected-metric'] = row.isSelected
    cssClasses['selected-metric-left'] = row.isSelected && index === 0
    cssClasses['selected-metric-interior'] =
      row.isSelected && index !== 0 && index !== row.cells.filter(_ => _.isVisible !== false).length - 1
    cssClasses['selected-metric-right'] =
      row.isSelected && index === row.cells.filter(_ => _.isVisible !== false).length - 1
    cssClasses['focused-metric'] = row.isFocused === true
    return cssClasses
  }

  private getIndentStyle(depth: number, index: number, cell: any) {
    const amountToIndent = 8 + ++depth * 8 + (this.rowToDisplay.isExpandable ? 0 : 11.875)
    const indentation = index === 0 ? { 'padding-left': `${amountToIndent}px` } : '{}'
    return indentation
  }
}
</script>

<style>
.data-row-renderer__icon {
  /* color: rgba(0, 0, 0, 0.87); */
  margin-right: 4px;
  margin-bottom: 1px;
  font-size: 9px;
  width: 0.875em !important;
}
.data-row-renderer__animation-enter-active,
.data-row-renderer__animation-leave-active {
  transition: opacity 4.3s;
}
.data-row-renderer__animation-enter,
.data-row-renderer__animation-leave-to {
  opacity: 0;
}
</style>
