<template>
  <span> {{ valueToDisplay(header) }}
      <i
        v-if="header.columnSorter"
        :class="getIconArray(header.columnSorter.sortDirection).join(' ')"
        :style="iconStyle(header)"
        style="color: #fff; font-size: 16px; vertical-align: middle; cursor: hand"
        @click="$emit('toggle-sort', header)"
      />
  </span>
</template>

<script lang="ts">
import { Component, Prop, toNative } from '@vuescape/decorators'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { SortDirection, TreeTableHeaderCell } from '@vuescape/index'

@Component({})
class FunctionalHeaderCellRenderer extends ComponentBase {
  @Prop({
    type    : Object,
    required: true,
  }) private header: TreeTableHeaderCell

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

  private iconStyle(header: TreeTableHeaderCell) {
    if (header?.columnSorter?.sortDirection === SortDirection.None) {
      const result: any = {
        '--fa-primary-opacity': 0.4,
      }

      return result
    }
  }

  private valueToDisplay(header: TreeTableHeaderCell) {
    if (header.displayValue != null) {
      return header.displayValue
    }

    return header.value
  }
}

export default toNative(FunctionalHeaderCellRenderer)
</script>
