<template>
  <v-tooltip right>
    <template v-slot:activator="{ on }">
      <span
        v-on="on"
        :class="cellToDisplay.cssClasses" 
      >{{cellToDisplay.value}}</span>
    </template>
    <v-card>
      <v-card-title primary-title>{{cellToDisplay.value}}</v-card-title>
      <v-divider light></v-divider>
      <span>{{cellToDisplay.title}}</span>
    </v-card>
  </v-tooltip>
</template>

<script lang='ts'>
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
