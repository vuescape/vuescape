<template>
  <div v-if="rowToDisplay.isVisible || rowToDisplay.shouldDisplayChildren">
    <component
      v-if="rowToDisplay.isVisible"
      :key="rowToDisplay.id"
      :is="rowToDisplay.renderer || 'DataRowRenderer'"
      :row="rowToDisplay"
      :shouldUseFunctionalRenderers="shouldUseFunctionalRenderers"
    ></component>
    <template
      v-if="rowToDisplay.children && rowToDisplay.children.length > 0 && (rowToDisplay.isExpanded || rowToDisplay.shouldDisplayChildren)"
    >
      <row-renderer
        v-for="childRow in rowToDisplay.children"
        :key="childRow.id"
        :row="childRow"
        :shouldUseFunctionalRenderers="shouldUseFunctionalRenderers"
      ></row-renderer>
    </template>
    <template
      v-if="rowToDisplay.expandedSummaryRows && rowToDisplay.expandedSummaryRows.length > 0 && rowToDisplay.isExpanded"
    >
      <row-renderer
        v-for="expandedRow in rowToDisplay.expandedSummaryRows"
        :key="expandedRow.id"
        :row="expandedRow"
        :shouldUseFunctionalRenderers="shouldUseFunctionalRenderers"
      ></row-renderer>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative } from '@vuescape/decorators'
import { registerGlobalComponent } from '@vuescape/infrastructure/globalComponents'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableRow } from '@vuescape/index'

import DataRowRenderer from '@vuescape/components/TreeTable-v2/DataRowRenderer.vue'

registerGlobalComponent('DataRowRenderer', DataRowRenderer)

@Component({
  name: 'row-renderer',
})
class RowRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow

  @Prop({ type: Boolean, default: false })
  private shouldUseFunctionalRenderers: boolean

  private get rowToDisplay() {
    return this.row
  }
}

export default toNative(RowRenderer)
</script>
