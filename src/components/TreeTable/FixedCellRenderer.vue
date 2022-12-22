<template>
  <span
    :title="cell.value"
    :class="cell.cssClasses"
  >{{ cell.value }}</span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableCell } from '@vuescape/index'

@Component({ components: {} })
export default class FixedCellRenderer extends ComponentBase {
  @Prop({
    type    : Object,
    required: true,
  }) private cell: TreeTableCell

  @Prop({
    type   : Boolean,
    default: false,
  }) private isHovering: boolean
}
</script>
