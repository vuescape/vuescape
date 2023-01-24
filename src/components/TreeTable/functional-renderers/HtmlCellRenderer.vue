<template functional>
  <span v-html="props.cell.displayValue != null ? props.cell.displayValue : props.cell.value"></span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Vue } from 'vue-property-decorator'

import { TreeTableCell } from '@vuescape/index'

@Component
export default class FunctionalHtmlCellRenderer extends Vue {
  @Prop({
    type    : Object,
    required: true,
  }) private cell: TreeTableCell
}
</script>
