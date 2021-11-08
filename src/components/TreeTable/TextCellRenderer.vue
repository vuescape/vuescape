<template>
  <span :class="cell.cssClasses">{{ cellValue }}</span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableCell } from '@vuescape/index'

@Component({})
export default class TextCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean

  private get cellValue() {
    return this.cell.displayValue != null ? this.cell.displayValue : this.cell.value
  }
}
</script>
