<template functional>
  <span
    :title="props.cell.value"
    :class="props.cell.cssClasses"
  >{{ props.cell.value }}</span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Vue } from 'vue-property-decorator'

import { TreeTableCell } from '@vuescape/index'

@Component
export default class FunctionalFixedCellRenderer extends Vue {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean
}
</script>
