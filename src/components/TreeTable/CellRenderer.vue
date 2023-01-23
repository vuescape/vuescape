<template>
  <component
    :key="cellToDisplay.id"
    :is="cellToDisplay.renderer || 'TextCellRenderer'"
    :cell="cellToDisplay"
    :isHovering="isHovering"
  ></component>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableCell } from '@vuescape/index'

import FixedCellRenderer from './FixedCellRenderer.vue'
import TextCellRenderer from './TextCellRenderer.vue'

@Component({
  components: {
    FixedCellRenderer,
    TextCellRenderer,
  },
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
