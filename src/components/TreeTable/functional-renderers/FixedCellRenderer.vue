<template>
  <span
    v-if="isExpandable"
    :class="cell.cssClasses"
    :title="cell.value"
  ><!-- Vue 3 trims a template's leading space, so it goes in the interpolation -->{{ ' ' + (cell.displayValue != null ? cell.displayValue : cell.value) }}
  </span>
  <span
    v-else
    :class="cell.cssClasses"
    :title="cell.value"
  >{{ cell.displayValue != null ? cell.displayValue : cell.value }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableCell } from '@vuescape/index'

@Component
class FunctionalFixedCellRenderer extends Vue {
  @Prop({
    type    : Object,
    required: true,
  }) private cell: TreeTableCell

  @Prop({
    type   : Boolean,
    default: false,
  }) private isHovering: boolean

  @Prop({
    type   : Boolean,
    default: false,
  }) private isExpandable: boolean
}

export default toNative(FunctionalFixedCellRenderer)
</script>
