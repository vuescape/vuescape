<template>
  <span></span>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableCell } from '@vuescape/index'

@Component
class FunctionalEmptyCellRenderer extends Vue {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean
}

export default toNative(FunctionalEmptyCellRenderer)
</script>
