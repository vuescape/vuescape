<template>
  <span v-html="cellValue"></span>
</template>

<script <script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableItem } from './TreeTableItem'

@Component({})
export default class HtmlCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableItem

  private get cellValue() {
    return this.cell.displayValue ? this.cell.displayValue : this.cell.value
  }
}
</script>
