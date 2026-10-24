<template>
  <span :class="cell.cssClasses" :title="cellValue">{{ cellValue }}</span>
</template>

<script lang="ts">
import { Component, Prop, toNative } from '@vuescape/decorators'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableCell } from '@vuescape/index'

@Component({})
class TextCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean

  private get cellValue() {
    return this.cell.displayValue != null ? this.cell.displayValue : this.cell.value
  }
}

export default toNative(TextCellRenderer)
</script>
