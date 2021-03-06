<template>
  <span class="tooltip__container">
    <span
      v-show="!isHoveringImpl"
      style="margin-left: -18px; width: 14px;display: inline-block;"
    >&nbsp;
    </span>
    <span v-show="isHoveringImpl">
      <v-menu
        :content-class="`tooltip__menu--${cell.id}`"
        v-model="shouldShowDialog"
        :close-on-content-click="false"
        top
        right
        :nudge-top="30"
        :nudge-right="20"
        max-width="500"
        transition="scale-transition"
        origin="bottom left"
      >
        <template v-slot:activator="{ on }">
          <font-awesome-icon
            :icon="['far', 'question-circle']"
            style="margin-left: -18px; font-size: 14px; color: #16a5c6; cursor: pointer; display: inline-block;"
            @click.stop="enableTooltip"
            v-on="on"
          />
        </template>

        <v-card flat>
          <v-card-title class="tooltip__v-card--title">
            <span class="tooltop__title--font">{{ title }}</span>
            <v-spacer></v-spacer>
            <span class="tooltip__title--close">
              <font-awesome-icon
                :icon="['fal', 'times']"
                style="cursor: pointer; font-size: 18px;"
                @click="
                stopVideo()
                shouldShowDialog = false
              "
              />
            </span>
          </v-card-title>
          <v-card-text>
            <span v-if="text">{{ text }} </span>
            <span
              v-else
              v-html="html"
              ref="hoverHtml"
            ></span>
          </v-card-text>
        </v-card>
      </v-menu>
    </span>
    <span style="width: 4px; min-width: 4px; max-width: 4px; display: inline-block;">
    </span>
  </span>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Action, namespace, State } from 'vuex-class'

import { ComponentBase, TreeTableItem, TreeTableRow } from '@vuescape/index'
import { ModuleState, ns, StoreOperation } from '@vuescape/store/modules'

@Component({})
export default class Tooltip extends ComponentBase {
  private shouldShowDialog = false

  @State('tooltipSingleton')
  private tooltipSingleton: ModuleState<Array<boolean>>

  @(namespace('tooltipSingleton').State((state: ModuleState<Array<boolean>>) => state.value))
  private tooltipSingletonValue: Array<boolean>

  @(namespace('tooltipSingleton').Mutation(StoreOperation.Mutation.SET_VALUE))
  private setTooltipSingleton: (val: Array<boolean>) => void

  @Prop({ type: Object, required: true })
  private cell: TreeTableItem

  @Prop({ type: Object, required: true })
  private row: TreeTableRow

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean

  private isHoveringImpl = false
  private hasOpened = false

  @Watch('shouldShowDialog')
  private async onShouldShowDialogChanged(newValue: boolean, oldValue: boolean) {
    if (this.hasOpened) {
      this.row.isFocused = newValue
    }
  }

  @Watch('isHovering')
  private onHoveringChanged(newValue: boolean, oldValue: boolean) {
    this.isHoveringImpl = newValue
  }

  @Watch('tooltipSingletonValue')
  private onTooltipSingletonValueChanged() {
    if (this.shouldShowDialog) {
      this.stopVideo()
    }
    this.shouldShowDialog = false
  }

  private stopVideo() {
    // If there's an iframe reset src...this stops video from playing by resetting src
    const hoverHtml = this.$refs.hoverHtml as any
    if (hoverHtml) {
      const iframe = hoverHtml.querySelector('iframe')
      if (iframe) {
        iframe.src = iframe.src
      }
    }
  }

  private get title() {
    return this.cell.hover ? this.cell.hover.title : ''
  }

  private get text() {
    return this.cell.hover ? this.cell.hover.text : ''
  }

  private get html() {
    return this.cell.hover ? this.cell.hover.html : ''
  }

  private async enableTooltip() {
    this.setTooltipSingleton([false])
    this.hasOpened = true
    this.shouldShowDialog = true
  }

  private beforeDestroy() {
    this.stopVideo()
  }

  private created() {
    this.isHoveringImpl = this.isHovering

    if (!this.tooltipSingleton) {
      this.registerStoreModuleWithInitialValue<Array<boolean>>('tooltipSingleton', [false])
    }
  }
}
</script>

<style>
.tooltip__v-card--title {
  font-size: 17px;
  font-weight: 400;
  padding-right: 8px;
  align-content: baseline;
}
.tooltop__title--font {
  font-weight: 500;
  width: 90% !important;
}
.tooltip__title--close {
  position: absolute;
  right: 8px;
  top: 4px;
}
</style>
