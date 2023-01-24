<template functional>
  <span> {{ $options.methods.valueToDisplay(props.header) }}
    <span
      v-if="props.header.columnSorter"
      @click="listeners['toggle-sort'](props.header)"
    >&nbsp;
      <font-awesome-icon
        :icon="$options.methods.getIconArray(props.header.columnSorter.sortDirection)"
        class=""
        :style="$options.methods.iconStyle(props.header)"
        style="color: #fff; font-size: 16px; vertical-align: middle; cursor: hand"
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
export default class FunctionalHeaderCellRenderer extends ComponentBase {
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
