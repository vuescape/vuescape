<template>
  <v-tooltip right hover>
    <template max-width="200" v-slot:activator="{ on }">
      <span :class="cellToDisplay.cssClasses">{{ cellToDisplay.value }} &nbsp;</span>
      <span v-on="on">
        <font-awesome-icon style="font-size: 16px; color: #0F738A;" :icon="['fal', 'question-circle']" />
      </span>
      <!-- temp activator that is not shown to disable tooltip -->
    </template>
    <v-card flat class="fixed-cell-renderer__card--hover">
      <v-card-title>
        <span class="title font-weight-light">{{cellToDisplay.value}}</span><v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        {{ cellToDisplay.value }} can be described as follows: Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum.
      </v-card-text>
    </v-card>
  </v-tooltip>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

import { TreeTableItem } from './TreeTableItem'

@Component({})
export default class FixedCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableItem

  private get cellToDisplay() {
    return this.cell
  }
}
</script>
<style>
.fixed-cell-renderer__card--hover {
  max-width: 300px;
}
</style>
