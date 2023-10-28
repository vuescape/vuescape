<template>
  <span>
    {{ valueToDisplay }}
      <i
        v-if="header.columnSorter"
        :key="header.columnSorter.sortDirection"
        :class="getIconArray(header.columnSorter.sortDirection).join(' ')"
        :style="iconStyle"
        style="cursor: pointer!important; color: #fff; font-size: 16px; vertical-align: middle;"
        @click="$emit('toggle-sort', header)"
      ></i>
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

    return []
  }
}
</script>
