<template functional>
  <span> {{ $options.methods.valueToDisplay(props.header) }}
      <i
        v-if="props.header.columnSorter"
        :class="$options.methods.getIconArray(props.header.columnSorter.sortDirection).join(' ')"
        :style="$options.methods.iconStyle(props.header)"
        style="color: #fff; font-size: 16px; vertical-align: middle; cursor: hand"
        @click="listeners['toggle-sort'](props.header)"
      />
  </span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { SortDirection, TreeTableHeaderCell } from '@vuescape/index'

@Component({})
export default class FunctionalHeaderCellRenderer extends ComponentBase {
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
</script>
