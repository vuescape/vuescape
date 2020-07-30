<template>
  <span :class="cell.cssClasses">{{ cellValue }}</span>
</template>

<script <script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableItem } from './TreeTableItem'

@Component({})
export default class DefaultCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableItem

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean

  private get cellValue() {
    return this.cell.displayValue ? this.cell.displayValue : this.cell.value
  }
}
</script>
