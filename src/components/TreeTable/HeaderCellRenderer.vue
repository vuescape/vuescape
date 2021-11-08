<template>
  <span>
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
export default class DefaultHeaderCellRenderer extends ComponentBase {
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

  private get valueToDisplay() {
    if (this.header.displayValue != null) {
      return this.header.displayValue
    }

    return this.header.value
  }
}
</script>
