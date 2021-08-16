<template>
  <span
    :style="cssStyle"
    :class="cell.cssClasses"
  >{{ cellValue }}</span>
</template>

<script <script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableCell } from '@vuescape/index'

@Component({})
export default class DefaultCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean

  private get cellValue() {
    return this.cell.displayValue != null ? this.cell.displayValue : this.cell.value
  }

  private get cssStyle() {
    const result: any = {
      '--tree-table__cell--font-color': this.cell.cellFormat ? this.cell.cellFormat.fontHexColor : 'inherit',
      '--tree-table__cell--font-size': this.cell.cellFormat ? this.cell.cellFormat.fontSize : 'inherit',
    }

    if (this.cell.cssStyles) {
      const cssProperties = Object.keys(this.cell.cssStyles)
      for (const cssProperty of cssProperties) {
        result[cssProperty] = this.cell.cssStyles[cssProperty]
      }
    }
    return result
  }
}
</script>

<style>
span {
  color: var(--tree-table__cell--font-color);
  font-size: var(--tree-table__cell--font-size);
}
</style>
