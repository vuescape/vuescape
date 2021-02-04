<template>
  <span
    :title="cell.value"
    :class="cell.cssClasses"
  >{{ cell.value }}</span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableItem } from './TreeTableItem'

@Component({ components: {} })
export default class FixedCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableItem

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean
}
</script>
