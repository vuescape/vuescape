<template functional>
<!--    <FunctionalTextCellRenderer-->
<!--      v-if="$options.methods.getCellRenderer(props.cell.renderer).name === 'FunctionalTextCellRenderer'"-->
<!--      :key="props.cell.id"-->
<!--      :cell="props.cell"-->
<!--      :isHovering="props.isHovering"-->
<!--    >-->
<!--    </FunctionalTextCellRenderer>-->
<!--  <FunctionalFixedCellRenderer-->
<!--    v-else-if="$options.methods.getCellRenderer(props.cell.renderer).name === 'FunctionalFixedCellRenderer'"-->
<!--    :key="props.cell.id"-->
<!--    :cell="props.cell"-->
<!--    :isHovering="props.isHovering"-->
<!--  >-->
<!--  </FunctionalFixedCellRenderer>-->
<!--  <FunctionalEmptyCellRenderer-->
<!--    v-else-if="$options.methods.getCellRenderer(props.cell.renderer).name === 'FunctionalEmptyCellRenderer'"-->
<!--    :key="props.cell.id"-->
<!--    :cell="props.cell"-->
<!--    :isHovering="props.isHovering"-->
<!--  >-->
<!--  </FunctionalEmptyCellRenderer>-->
<!--  <FunctionalHeaderCellRenderer-->
<!--    v-else-if="$options.methods.getCellRenderer(props.cell.renderer).name === 'FunctionalHeaderCellRenderer'"-->
<!--    :key="props.cell.id"-->
<!--    :cell="props.cell"-->
<!--    :isHovering="props.isHovering"-->
<!--  >-->
<!--  </FunctionalHeaderCellRenderer>-->
<!--  <FunctionalHtmlCellRenderer-->
<!--    v-else-if="$options.methods.getCellRenderer(props.cell.renderer).name === 'FunctionalHtmlCellRenderer'"-->
<!--    :key="props.cell.id"-->
<!--    :cell="props.cell"-->
<!--    :isHovering="props.isHovering"-->
<!--  >-->
<!--  </FunctionalHtmlCellRenderer>-->
<!--  <div v-else>Oops</div>-->
  <component
    :is="$options.methods.getCellRenderer(props.cell.renderer)"
    :key="props.cell.id"
    :cell="props.cell"
    :isHovering="props.isHovering"
  ></component>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Vue } from 'vue-property-decorator'

import { TreeTableCell } from '@vuescape/index'

@Component
export default class FunctionalCellRenderer extends Vue {
  @Prop({
    type    : Object,
    required: true,
  }) private cell: TreeTableCell

  @Prop({
    type   : Boolean,
    default: false,
  }) private isHovering: boolean

  private getCellRenderer(renderer: any) {
    if (typeof renderer === 'function') {
      return renderer
    }

    const rendererValue = renderer || 'FunctionalTextCellRenderer'
    const result        = require(`./${rendererValue}.vue`).default
    return result
  }
}
</script>
