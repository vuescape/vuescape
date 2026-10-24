<template>
  <span
    :title="cell.value"
    :class="cell.cssClasses"
  >{{ cell.value }}</span>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableCell } from '@vuescape/index'

@Component
class FunctionalFixedCellRenderer extends Vue {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean
}

export default toNative(FunctionalFixedCellRenderer)
</script>
