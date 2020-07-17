<template>
  <span @mouseleave="isHover = false" @mouseover="enableHoverOver">
    <span :class="cell.cssClasses">{{ cell.value }} &nbsp;</span>
    <span v-if="canHover">
      <transition name="fixed-cell-renderer__animation" mode="out-in">
        <tooltip :cell="cell" v-show="isHover"> ></tooltip>
      </transition>
    </span>
    <!-- temp activator that is not shown to disable tooltip -->
  </span>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

const Tooltip = () => import(/* webpackChunkName: 'tool-tip' */ '@vuescape/components/Tooltip/').then(m => m.default)

import { TreeTableItem } from './TreeTableItem'

@Component({ components: { Tooltip } })
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

  private xPosition = '50%'
  private yPosition = '50%'

  private enableHoverOver(e: any) {    
    console.info(e)
    this.xPosition = e.clientX + 'px'
    this.yPosition = e.clientY + 'px'
    this.isHover = true
  }
}
</script>
<style>
.fixed-cell-renderer__animation-enter-active,
.fixed-cell-renderer__animation-leave-active {
  transition: opacity 0.3s;
}
.fixed-cell-renderer__animation-enter,
.fixed-cell-renderer__animation-leave-to {
  opacity: 0;
}
</style>
