<template>
  <component
    :key="cellToDisplay.id"
    :is="cellToDisplay.renderer || 'DefaultCellRenderer'"
    :cell="cellToDisplay"
    :isHovering="isHovering"
  ></component>
</template>

<script <script lang='ts'>
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableCell } from '@vuescape/index'

import DefaultCellRenderer from './DefaultCellRenderer.vue'
import FixedCellRenderer from './FixedCellRenderer.vue'

@Component({
  components: { DefaultCellRenderer, FixedCellRenderer },
})
export default class CellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean

  private get cellToDisplay() {
    return this.cell
  }
}
</script>
