<template functional>
  <div v-if="props.row.isVisible">
    <component
      :key="props.row.id"
      :is="props.row.renderer"
      :row="props.row"
      :shouldUseFunctionalRenderers="true"
    ></component>
    <template v-if="props.row.children && props.row.children.length > 0 && props.row.isExpanded">
      <functional-row-renderer
        v-for="childRow in props.row.children"
        :key="childRow.id"
        :row="childRow"
      ></functional-row-renderer>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { TreeTableRow } from '@vuescape/index'

@Component({
  // name is required to avoid error with recursion
  name: 'functional-row-renderer',
})
export default class FunctionalRowRenderer extends Vue {
  @Prop({ type: Object, required: true })
  private row: TreeTableRow
}
</script>
