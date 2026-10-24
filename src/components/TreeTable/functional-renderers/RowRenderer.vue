<template>
  <div v-if="row.isVisible">
    <component
      :key="row.id"
      :is="row.renderer"
      :row="row"
      :shouldUseFunctionalRenderers="true"
    ></component>
    <template v-if="row.children && row.children.length > 0 && row.isExpanded">
      <functional-row-renderer
        v-for="childRow in row.children"
        :key="childRow.id"
        :row="childRow"
      ></functional-row-renderer>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableRow } from '@vuescape/index'

@Component({
  // name is required to avoid error with recursion
  name: 'functional-row-renderer',
})
class FunctionalRowRenderer extends Vue {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow
}

export default toNative(FunctionalRowRenderer)
</script>
