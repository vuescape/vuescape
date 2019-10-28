<template>
  <component
    :key="cellToDisplay.id"
    :is="cellToDisplay.renderer || 'DefaultCellRenderer'"
    :cell="cellToDisplay"
  ></component>
</template>

<script <script lang='ts'>
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableItem } from './TreeTableItem'

import DefaultCellRenderer from './DefaultCellRenderer.vue'
import FixedCellRenderer from './FixedCellRenderer.vue'

@Component({
  components: { DefaultCellRenderer, FixedCellRenderer },
})
export default class CellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableItem

  private get cellToDisplay() {
    return this.cell
  }
}
</script>
