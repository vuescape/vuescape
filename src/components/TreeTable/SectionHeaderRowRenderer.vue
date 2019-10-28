<template>
  <tr
    :class="rowToDisplay.cssClasses"
    :key='rowToDisplay.id'
  >
    <td
      v-for='(cell, index) in rowToDisplay.items'
      class="subheader"
      :class="[{ 'tree-table-item--clickable':  index === 0 ? rowToDisplay.isExpandable && cell.onclick : cell.onclick  }, cell.cssClasses]"
      :key='cell.id'
      :colspan='cell.colspan'
      @click="cell.onclick && cell.onclick(row, cell)"
    >
    <!-- style="font-family: 'Segoe UI', Verdana, 'Roboto', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;" -->
      <span :style="getIndentStyle(rowToDisplay.depth)">
        <span v-if="index === 0" :class="cell.cssClasses">
          {{ cell.value }}
        </span>
      </span>
    </td>
  </tr>
</template>

<script <script lang='ts'>
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableHeaderRow } from './TreeTableHeaderRow'
import { TreeTableItem } from './TreeTableItem'
import { TreeTableRow } from './TreeTableRow'

@Component({
})
export default class SectionHeaderRowRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow

  private get rowToDisplay() {
    return this.row
  }

  private getIndentStyle(depth: number) {
    const indentation = { 'text-indent': `${depth}em` }
    return indentation
  }
}
</script>
