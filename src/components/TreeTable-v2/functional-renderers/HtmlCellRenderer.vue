<template>
  <span v-html="cell.displayValue != null ? cell.displayValue : cell.value"></span>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableCell } from '@vuescape/index'

@Component
class FunctionalHtmlCellRenderer extends Vue {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean
}

export default toNative(FunctionalHtmlCellRenderer)
</script>
