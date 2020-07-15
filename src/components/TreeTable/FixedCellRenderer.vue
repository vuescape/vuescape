<template>
  <span @mouseleave="isHover = false" @mouseover="isHover = true">
    <v-tooltip right hover>
      <template max-width="200" v-slot:activator="{ on }">
        <span :class="cell.cssClasses">{{ cell.value }} &nbsp;</span>
        <span v-on="on" style="vertical-align: text-top;">
          <transition name="fixed-cell-renderer__animation" mode="out-in">
            <font-awesome-icon
              v-if="canHover && isHover"
              style="font-size: 14px; color: #16a5c6;"
              :icon="['fal', 'info-circle']"
            />
          </transition>
        </span>
        <!-- temp activator that is not shown to disable tooltip -->
      </template>
      <v-card flat class="fixed-cell-renderer__card--hover">
        <v-card-title>
          <span class="title font-weight-light">{{ hoverTitle }}</span
          ><v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <span v-if="hoverText">{{ hoverText }} </span>
          <span v-else v-html="hoverHtml"></span>
        </v-card-text>
      </v-card>
    </v-tooltip>
  </span>
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

  private isHover = false

  private get canHover() {
    return this.cell.hover
  }

  private get hoverTitle() {
    return this.cell.hover ? this.cell.hover.title : ''
  }

  private get hoverText() {
    return this.cell.hover ? this.cell.hover.text : ''
  }

  private get hoverHtml() {
    return this.cell.hover ? this.cell.hover.html : ''
  }
}
</script>
<style>
.fixed-cell-renderer__card--hover {
  max-width: 300px;
}
.fixed-cell-renderer__animation-enter-active,
.fixed-cell-renderer__animation-leave-active {
  transition: opacity 0.3s;
}
.fixed-cell-renderer__animation-enter,
.fixed-cell-renderer__animation-leave-to {
  opacity: 0;
}
</style>
