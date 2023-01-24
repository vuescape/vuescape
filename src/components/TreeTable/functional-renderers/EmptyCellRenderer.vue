<template functional>
  <span></span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Vue } from 'vue-property-decorator'

import { TreeTableCell } from '@vuescape/index'

@Component
export default class FunctionalEmptyCellRenderer extends Vue {
  @Prop({
    type    : Object,
    required: true,
  })
  private cell: TreeTableCell

  @Prop({
    type   : Boolean,
    default: false,
  })
  private isHovering: boolean
}
</script>
