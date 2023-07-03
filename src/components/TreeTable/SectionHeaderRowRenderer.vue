<template>
  <tr
    :class="rowToDisplay.cssClasses"
    :key="rowToDisplay.id"
  >
    <td
      v-for="(cell, index) in rowToDisplay.cells.filter(_ => _.isVisible !== false)"
      :class="[
        { 'tree-table-item__td--clickable': index === 0 ? rowToDisplay.isExpandable && cell.onclick : cell.onclick },
        cell.cssClasses,
      ]"
      :key="cell.id"
      :colspan="cell.colspan"
      @click="cell.onclick && cell.onclick(rowToDisplay, cell)"
    >
      <span v-if="index === 0 && rowToDisplay.isExpandable" class="section-header-row-renderer__icon">
        <i
          v-if="rowToDisplay.isExpanded"
          class="fa-light fa-chevron-down"
        ></i>
        <i
          v-if="!rowToDisplay.isExpanded"
          class="fa-light fa-chevron-right"
        ></i>
      </span>
      <span :style="getIndentStyle(rowToDisplay.depth)">
        <span
          v-if="index === 0"
          :class="cell.cssClasses"
        >
          {{ cell.value }}
        </span>
      </span>
    </td>
  </tr>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableRow } from '@vuescape/index'

@Component({})
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
<style scoped>
.section-header-row-renderer__icon.fa-chevron-down {
  margin-top: 6px;
}
.section-header-row-renderer__icon {
  /* color: rgba(0, 0, 0, 0.87); */
  /* margin-left: -2px; */
  font-size:     10px;
  margin-top: 6px;
  vertical-align: top;
  width:         0.875em !important;
}
</style>
