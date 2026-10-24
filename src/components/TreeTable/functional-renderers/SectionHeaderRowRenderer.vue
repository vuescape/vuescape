<template>
  <tr
    :key="row.id"
    :class="row.cssClasses"
  >
    <td
      v-for="(cell, index) in row.cells.filter(_ => _.isVisible !== false)"
      :key="cell.id"
      :class="[
        { 'tree-table-item__td--clickable': index === 0 ? row.isExpandable && cell.onclick : cell.onclick },
        cell.cssClasses,
      ]"
      :colspan="cell.colspan"
      @click="cell.onclick && cell.onclick(row, cell)"
    >
      <span v-if="index === 0 && row.isExpandable">
        <i
          v-if="row.isExpanded"
          class="section-header-row-renderer__icon fa-light fa-chevron-down"
        />
        <!-- <i v-if="rowToDisplay.isExpanded" class="material-icons">expand_less</i> -->
        <i
          v-if="!row.isExpanded"
          class="section-header-row-renderer__icon fa-light fa-chevron-right"
        />
        <!-- <i v-if="!rowToDisplay.isExpanded" class="material-icons">chevron_right</i> -->
      </span>
      <span :style="`'text-indent': ${row.depth}em;`">
        <span
          v-if="index === 0"
          :class="cell.cssClasses"
        > {{ cell.value }}
        </span>
      </span>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

import { TreeTableRow } from '@vuescape/index'

@Component({})
class FunctionalSectionHeaderRowRenderer extends Vue {
  @Prop({
    type    : Object,
    required: true,
  }) private row: TreeTableRow
}

export default toNative(FunctionalSectionHeaderRowRenderer)
</script>
<style scoped>
.section-header-row-renderer__icon.fa-chevron-down {
  margin-top: 6px;
}
.section-header-row-renderer__icon {
  /* color: rgba(0, 0, 0, 0.87); */
  /* margin-left: -2px; */
  font-size:     10px;
  margin-top: 6px;
  vertical-align: top;
  width:         0.875em !important;
}
</style>
