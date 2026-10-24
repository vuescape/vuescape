<template>
  <div v-if="rowToDisplay.isVisible">
    <component
      :key="rowToDisplay.id"
      :is="rowToDisplay.renderer"
      :row="rowToDisplay"
    ></component>
    <template v-if="rowToDisplay.children && rowToDisplay.children.length > 0 && rowToDisplay.isExpanded">
      <row-renderer
        v-for="childRow in rowToDisplay.children"
        :key="childRow.id"
        :row="childRow"
      ></row-renderer>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative } from '@vuescape/decorators'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableRow } from '@vuescape/index'

@Component({
  // name is required to avoid error with recursion
  name: 'row-renderer',
})
class RowRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow

  private get rowToDisplay() {
    return this.row
  }
}

export default toNative(RowRenderer)
</script>
