<template>
  <component
    :is="getCellRenderer(cell.renderer)"
    :key="cell.id"
    :cell="cell"
    :isHovering="isHovering"
    :isExpandable="isExpandable"
  ></component>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableCell } from '@vuescape/index'

@Component
class FunctionalCellRenderer extends Vue {
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

  private getCellRenderer(renderer: any) {
    if (typeof renderer === 'function') {
      return renderer
    }

    const rendererValue = renderer || 'TextCellRenderer'
    // Renderer components are resolved by name at runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const result        = require(`./${rendererValue}.vue`).default
    return result
  }
}

export default toNative(FunctionalCellRenderer)
</script>
