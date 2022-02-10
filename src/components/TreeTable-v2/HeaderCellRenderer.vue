<template>
  <span
    class="tree-table__rendered-cell"
    :style="cssStyle"
    :class="header.cssClasses"
  >
    {{ valueToDisplay  }}
    <span
      v-if="header.columnSorter"
      @click="$emit('toggle-sort', header)"
    >&nbsp;
      <font-awesome-icon
        :icon="getIconArray(header.columnSorter.sortDirection)"
        class=""
        style="color: #FFF; font-size: 16px; vertical-align: middle; cursor: hand;"
      />
    </span>
  </span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { SortDirection, TreeTableHeaderCell } from '@vuescape/index'

@Component({})
export default class HeaderCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private header: TreeTableHeaderCell

  private getIconArray(sortDirection: SortDirection = SortDirection.None) {
    if (sortDirection === SortDirection.None) {
      return ['fad', 'sort']
    }
    if (sortDirection === SortDirection.Ascending) {
      return ['fad', 'sort-up']
    }
    if (sortDirection === SortDirection.Descending) {
      return ['fad', 'sort-down']
    }
  }

  private get cssStyle() {
    const result: any = {
      '--tree-table__cell--font-color': this.header.cellFormat ? this.header.cellFormat.fontHexColor : 'inherit',
      '--tree-table__cell--font-size': this.header.cellFormat ? this.header.cellFormat.fontSizeInPixels : 'inherit',
    }

    if (this.header.cssStyles) {
      const cssProperties = Object.keys(this.header.cssStyles)
      for (const cssProperty of cssProperties) {
        result[cssProperty] = this.header.cssStyles[cssProperty]
      }
    }
    return result
  }

  private get valueToDisplay() {
    if (this.header.displayValue != null) {
      return this.header.displayValue
    }

    return this.header.value
  }
}
</script>
