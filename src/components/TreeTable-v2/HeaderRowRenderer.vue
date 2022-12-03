<template>
  <tr
    :class="headerRow.cssClasses"
    :key="headerRow.id"
  >
    <th
      v-for="(header, index) in headerRow.cells.filter(_ => _.isVisible !== false)"
      :data-column-index="index"
      :class="header.cssClasses"
      :style="[getCellStyle(index, header)]"
      :key="header.id"
      :colspan="header.colspan"
    >
      <component
        :is="header.renderer || 'HeaderCellRenderer'"
        :header="header"
        @toggle-sort="toggleSort($event)"
      ></component>
    </th>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableHeaderCell, TreeTableHeaderRow } from '@vuescape/index'

import HeaderCellRenderer from '@vuescape/components/TreeTable-v2/HeaderCellRenderer.vue'

Vue.component('HeaderCellRenderer', HeaderCellRenderer)

@Component({})
export default class HeaderRowRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private row: TreeTableHeaderRow

  private get headerRow() {
    return this.row
  }

  private toggleSort(header: TreeTableHeaderCell) {
    this.$emit('toggle-sort', header)
  }

  private getCellStyle(index: number, cell: TreeTableHeaderCell) {
    const result: any = {}
    Object.assign(result, cell.cssStyles)

    if (cell?.cellFormat?.backgroundHexColor) {
      result['--tree-table__cell--background-color'] = cell.cellFormat.backgroundHexColor
    }

    return result
  }
}
</script>
