<template>
  <tr :class="rowToDisplay.cssClasses" :key="rowToDisplay.id">
    <td
      @mouseleave="onMouseLeave(cell)"
      @mouseover="onMouseEnter(cell)"
      v-for="(cell, index) in rowToDisplay.items"
      :style="getIndentStyle(rowToDisplay.depth, index, cell)"
      class="cell--border"
      :class="[getCellClasses(cell, rowToDisplay, index), cell.cssClasses]"
      :key="createKey(cell)"
      :colspan="cell.colspan"
      @click="cell.onclick && cell.onclick(rowToDisplay, cell)"
    >
      <span v-if="index === 0 && rowToDisplay.isExpandable">
        <font-awesome-icon
          v-if="rowToDisplay.isExpanded"
          class="data-row-renderer__icon"
          :icon="['fal', 'chevron-down']"
        />
        <!-- <i v-if="rowToDisplay.isExpanded" class="material-icons">expand_less</i> -->
        <font-awesome-icon
          v-if="!rowToDisplay.isExpanded"
          class="data-row-renderer__icon"
          :icon="['fal', 'chevron-right']"
        />
        <!-- <i v-if="!rowToDisplay.isExpanded" class="material-icons">chevron_right</i> -->
      </span>
      <span>
        <cell-renderer :key="rowToDisplay.id" :cell="cell" :isHovering="cell.hover && isHovering"></cell-renderer>
        <span v-if="cell.hover && cell.hover.component"
          >&nbsp;<transition name="data-row-renderer__animation" mode="out-in">
            <component
              :is="cell.hover.component"
              :cell="cell"
              :isHovering="isHovering"
              v-bind="{ ...cell.hover.props }"
              style="vertical-align: text-top; pointer-events: none;"
            ></component>
          </transition>
        </span>
      </span>
    </td>
  </tr>
</template>

<script <script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import TreeTable from '.'
import { TreeTableItem } from './TreeTableItem'
import { TreeTableRow } from './TreeTableRow'

import CellRenderer from './CellRenderer.vue'

const Tooltip = () => import(/* webpackChunkName: 'tool-tip' */ '@vuescape/components/Tooltip/').then(m => m.default)

@Component({
  components: { CellRenderer, Tooltip, TreeTable },
})
export default class DataRowRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow

  private isHovering = false

  private get rowToDisplay() {
    return this.row
  }

  private onMouseEnter(cell: any) {
    this.setIsHovering(cell, true)
  }
  private onMouseLeave(cell: any, e: any) {
    this.setIsHovering(cell, false)
  }
  
  private setIsHovering(cell: any, isHovering: boolean) {
    if (cell.hover) {
      this.isHovering = isHovering
    }
    if (cell.triggerHoverInCells && cell.triggerHoverInCells.length) {
      const matches = this.row.items
        .filter(_ => cell.triggerHoverInCells.includes(_.id))
        .forEach(_ => {
          if (_.hover) {
            this.isHovering = isHovering
          }
        })
    }
  }

  private getCellClasses(cell: TreeTableItem, row: TreeTableRow, index: number) {
    const cssClasses = {} as any
    cssClasses['tree-table-item__td--clickable'] = typeof cell.onclick === typeof Function
    cssClasses['selected-metric'] = row.isSelected
    cssClasses['selected-metric-left'] = row.isSelected && index === 0
    cssClasses['selected-metric-interior'] = row.isSelected && index !== 0 && index !== row.items.length - 1
    cssClasses['selected-metric-right'] = row.isSelected && index === row.items.length - 1
    return cssClasses
  }

  private createKey(cell: any) {
    const key = `${this.row.id}-${cell.id}-${cell.hover ? `-${this.isHovering.toString()}` : ''}`
    return key
  }

  private getIndentStyle(depth: number, index: number, cell: any) {
    const indentation = index === 0 ? { 'padding-left': `${++depth * 1.4}em` } : '{}'
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

<style></style>
