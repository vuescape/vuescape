<template functional>
  <span
    v-if="props.isExpandable"
    :class="props.cell.cssClasses"
    :title="props.cell.value"
  > {{ props.cell.displayValue != null ? props.cell.displayValue : props.cell.value }}
  </span>
  <span
    v-else
    :class="props.cell.cssClasses"
    :title="props.cell.value"
  >{{ props.cell.displayValue != null ? props.cell.displayValue : props.cell.value }}
  </span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Vue } from 'vue-property-decorator'

import { TreeTableCell } from '@vuescape/index'

@Component
export default class FunctionalFixedCellRenderer extends Vue {
  @Prop({
    type    : Object,
    required: true,
  }) private cell: TreeTableCell

  @Prop({
    type   : Boolean,
    default: false,
  }) private isHovering: boolean

  @Prop({
    type   : Boolean,
    default: false,
  }) private isExpandable: boolean
}
</script>
