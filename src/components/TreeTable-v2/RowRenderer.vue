<template>
  <div v-if="rowToDisplay.isVisible || rowToDisplay.shouldDisplayChildren">
    <component
      v-if="rowToDisplay.isVisible"
      :key="rowToDisplay.id"
      :is="rowToDisplay.renderer || 'DataRowRenderer'"
      :row="rowToDisplay"
    ></component>
    <template
      v-if="rowToDisplay.children && rowToDisplay.children.length > 0 && (rowToDisplay.isExpanded || rowToDisplay.shouldDisplayChildren)">
      <row-renderer
        v-for="childRow in rowToDisplay.children"
        :key="childRow.id"
        :row="childRow"
      ></row-renderer>
    </template>
    <template
      v-if="rowToDisplay.expandedSummaryRows && rowToDisplay.expandedSummaryRows.length > 0 && rowToDisplay.isExpanded">
      <row-renderer
        v-for="expandedRow in rowToDisplay.expandedSummaryRows"
        :key="expandedRow.id"
        :row="expandedRow"
      ></row-renderer>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableRow } from '@vuescape/index'

import DataRowRenderer from '@vuescape/components/TreeTable-v2/DataRowRenderer.vue'

Vue.component('DataRowRenderer', DataRowRenderer)

@Component({
  name: 'row-renderer',
})
export default class RowRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow

  private get rowToDisplay() {
    return this.row
  }
}
</script>
