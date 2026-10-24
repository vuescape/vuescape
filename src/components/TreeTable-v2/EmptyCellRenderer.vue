<template>
  <span></span>
</template>

<script lang="ts">
import { Component, Prop, toNative } from '@vuescape/decorators'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableCell } from '@vuescape/index'

@Component({})
class EmptyCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean
}

export default toNative(EmptyCellRenderer)
</script>
