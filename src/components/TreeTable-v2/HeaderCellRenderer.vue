<template>
  <span
    :class="header.cssClasses"
    :style="cssStyle"
    class="tree-table__rendered-cell"
  >
    {{ valueToDisplay }}
      <i
        v-if="header.columnSorter"
        :class="getIconArray(header.columnSorter.sortDirection).join(' ')"
        :style="iconStyle"
        style="color: #fff; font-size: 16px; vertical-align: middle; cursor: hand"
        @click="$emit('toggle-sort', header)"
      />
  </span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { SortDirection, TreeTableHeaderCell } from '@vuescape/index'

@Component({})
export default class HeaderCellRenderer extends ComponentBase {
  @Prop({
    type    : Object,
    required: true,
  }) private header: TreeTableHeaderCell

  private get iconStyle() {
    if (this.header?.columnSorter?.sortDirection === SortDirection.None) {
      const result: any = {
        '--fa-primary-opacity': 0.4,
      }

      return result
    }
  }

  private get cssStyle() {
    const result: any = {
      '--tree-table__cell--font-color': this.header.cellFormat ? this.header.cellFormat.fontHexColor : 'inherit',
      '--tree-table__cell--font-size' : this.header.cellFormat ? this.header.cellFormat.fontSizeInPixels : 'inherit',
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

  private getIconArray(sortDirection: SortDirection = SortDirection.None) {
    if (sortDirection === SortDirection.None) {
      return ['fa-duotone', 'fa-sort']
    }
    if (sortDirection === SortDirection.Ascending) {
      return ['fa-duotone', 'fa-sort-up']
    }
    if (sortDirection === SortDirection.Descending) {
      return ['fa-duotone', 'fa-sort-down']
    }
  }
}
</script>
