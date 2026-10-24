<template>
  <span
    :class="cell.cssClasses"
    :title="cell.displayValue != null ? cell.displayValue : cell.value"
  >
    {{ cell.displayValue != null ? cell.displayValue : cell.value }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableCell } from '@vuescape/index'

@Component
class FunctionalTextCellRenderer extends Vue {
  @Prop({
    type    : Object,
    required: true,
  }) private cell: TreeTableCell

  @Prop({
    type   : Boolean,
    default: false,
  }) private isHovering: boolean
}

export default toNative(FunctionalTextCellRenderer)
</script>
