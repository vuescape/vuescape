<template>
  <tr
    :key="rowToDisplay.id"
    :class="rowToDisplay.cssClasses"
  >
    <td
      v-for="(cell, index) in rowToDisplay.cells.filter(_ => _.isVisible !== false)"
      :key="cell.id"
      :class="[getCellClasses(cell, rowToDisplay, index), cell.cssClasses]"
      :colspan="cell.colspan"
      :style="getCssStyleObject(rowToDisplay.depth, index, cell)"
      class="cell--border"
      @click="cell.onclick && cell.onclick(rowToDisplay, cell)"
      @mouseleave="onMouseLeave(cell)"
      @mouseover="onMouseEnter(cell)"
    >
      <span
        v-if="index === 0"
        class="data-row-renderer__span--vertical-align"
      >
        <span v-if="cell.hover && cell.hover.component">
          <!-- style="position: relative;" -->
          <component
            :is="cell.hover.component"
            :cell="cell"
            :isHovering="isHovering"
            :row="rowToDisplay"
          ></component>
          <!-- style="vertical-align: text-top;margin-right: 4px;position: absolute; right: 0;" -->
        </span>

        <span v-if="rowToDisplay.isExpandable">
          <font-awesome-icon
            v-if="rowToDisplay.isExpanded"
            :icon="['fal', 'chevron-down']"
            class="data-row-renderer__icon"
          />
          <font-awesome-icon
            v-else
            :icon="['fal', 'chevron-right']"
            class="data-row-renderer__icon"
          />
        </span>
        <!--        <span v-if="!cell.hover || !cell.hover.component">&nbsp;</span>-->
      </span>
      <span class="data-row-renderer__span--vertical-align">
        <functional-cell-renderer
          v-if="shouldUseFunctionalRenderers"
          :key="cellKey(cell)"
          :cell="cell"
          :isHovering="cell.hover && isHovering"
        ></functional-cell-renderer>
        <cell-renderer
          v-else
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
import FunctionalCellRenderer from './functional-renderers/CellRenderer.vue'

@Component({
  components: {
    CellRenderer,
    FunctionalCellRenderer,
  },
})
export default class DataRowRenderer extends ComponentBase {
  @Prop({
    type    : Object,
    required: true,
  }) private row: TreeTableRow

  @Prop({
    type   : Boolean,
    default: false,
  }) private shouldUseFunctionalRenderers: boolean

  private isHovering = false

  private get rowToDisplay() {
    return this.row
  }

  private cellKey(cell: TreeTableCell) {
    return cell.id + '_' + (cell.renderer ? (cell.renderer.name || cell.renderer) : 'TextCellRenderer')
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
    const cssClasses                             = {} as any
    cssClasses['tree-table-item__td--clickable'] = typeof cell.onclick === typeof Function
    cssClasses['selected-metric']                = row.isSelected
    cssClasses['selected-metric-left']           = row.isSelected && index === 0
    cssClasses['selected-metric-interior']       = row.isSelected && index !== 0 && index !== row.cells.filter(_ => _.isVisible !== false).length - 1
    cssClasses['selected-metric-right']          = row.isSelected && index === row.cells.filter(_ => _.isVisible !== false).length - 1
    cssClasses['focused-metric']                 = row.isFocused === true
    return cssClasses
  }

  private getCssStyleObject(depth: number, index: number, cell: any) {
    const result: any = {}

    if (cell.cssStyles) {
      const cssProperties = Object.keys(cell.cssStyles)
      for (const cssProperty of cssProperties) {
        result[cssProperty] = cell.cssStyles[cssProperty]
      }
    }

    if (index === 0) {
      // If there is no hover then adjust the indentation
      const adjustment       = cell.hover?.component ? 0 : 3
      const amountToIndent   = 12 + ++depth * 8 + (this.rowToDisplay.isExpandable ? 0 : 11.875) + adjustment
      result['padding-left'] = `${amountToIndent}px`
    }

    return result
  }
}
</script>

<style>
.data-row-renderer__icon {
  /* color: rgba(0, 0, 0, 0.87); */
  margin-right:  4px;
  margin-bottom: 2px;
  font-size:     9px;
  width:         0.875em !important;
}
.data-row-renderer__animation-enter-active,
.data-row-renderer__animation-leave-active {
  transition: opacity 4.3s;
}
.data-row-renderer__animation-enter,
.data-row-renderer__animation-leave-to {
  opacity: 0;
}
.data-row-renderer__span--vertical-align {
  vertical-align: middle;
}
</style>
