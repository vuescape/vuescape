<template>
<!--    <FunctionalTextCellRenderer-->
<!--      v-if="getCellRenderer(cell.renderer).name === 'FunctionalTextCellRenderer'"-->
<!--      :key="cell.id"-->
<!--      :cell="cell"-->
<!--      :isHovering="isHovering"-->
<!--    >-->
<!--    </FunctionalTextCellRenderer>-->
<!--  <FunctionalFixedCellRenderer-->
<!--    v-else-if="getCellRenderer(cell.renderer).name === 'FunctionalFixedCellRenderer'"-->
<!--    :key="cell.id"-->
<!--    :cell="cell"-->
<!--    :isHovering="isHovering"-->
<!--  >-->
<!--  </FunctionalFixedCellRenderer>-->
<!--  <FunctionalEmptyCellRenderer-->
<!--    v-else-if="getCellRenderer(cell.renderer).name === 'FunctionalEmptyCellRenderer'"-->
<!--    :key="cell.id"-->
<!--    :cell="cell"-->
<!--    :isHovering="isHovering"-->
<!--  >-->
<!--  </FunctionalEmptyCellRenderer>-->
<!--  <FunctionalHeaderCellRenderer-->
<!--    v-else-if="getCellRenderer(cell.renderer).name === 'FunctionalHeaderCellRenderer'"-->
<!--    :key="cell.id"-->
<!--    :cell="cell"-->
<!--    :isHovering="isHovering"-->
<!--  >-->
<!--  </FunctionalHeaderCellRenderer>-->
<!--  <FunctionalHtmlCellRenderer-->
<!--    v-else-if="getCellRenderer(cell.renderer).name === 'FunctionalHtmlCellRenderer'"-->
<!--    :key="cell.id"-->
<!--    :cell="cell"-->
<!--    :isHovering="isHovering"-->
<!--  >-->
<!--  </FunctionalHtmlCellRenderer>-->
<!--  <div v-else>Oops</div>-->
  <component
    :is="getCellRenderer(cell.renderer)"
    :key="cell.id"
    :cell="cell"
    :isHovering="isHovering"
    :isExpandable="isExpandable"
  ></component>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableCell } from '@vuescape/index'

@Component
class FunctionalCellRenderer extends Vue {
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

  private getCellRenderer(renderer: any) {
    if (typeof renderer === 'function') {
      return renderer
    }

    const rendererValue = renderer || 'TextCellRenderer'
    // Renderer components are resolved by name at runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const result        = require(`./${rendererValue}.vue`).default
    return result
  }
}

export default toNative(FunctionalCellRenderer)
</script>
