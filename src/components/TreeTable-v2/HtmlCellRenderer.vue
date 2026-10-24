<template>
  <span v-html="cellValue"></span>
</template>

<script lang="ts">
import { Component, Prop, toNative } from '@vuescape/decorators'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableCell } from '@vuescape/index'

@Component({})
class HtmlCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  private get cellValue() {
    return this.cell.displayValue != null ? this.cell.displayValue : this.cell.value
  }
}

export default toNative(HtmlCellRenderer)
</script>
