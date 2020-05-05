<template>
  <span>
    {{ header.value }}
    <span v-if="header.isSortable" @click="$emit('toggle-sort', header)"
      >&nbsp;
      <font-awesome-icon
        :icon="getIconArray(header.sortDirection)"
        class=""
        style="color: #FFF; font-size: 16px; vertical-align: middle; cursor: hand;"
      />
    </span>
  </span>
</template>

<script <script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { SortDirection } from './SortDirection'
import { TreeTableHeaderItem } from './TreeTableHeaderItem'

@Component({})
export default class DefaultHeaderCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private header: TreeTableHeaderItem

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
}
</script>
