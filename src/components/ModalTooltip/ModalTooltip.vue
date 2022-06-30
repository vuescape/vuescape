<template>
  <span class="modal-tooltip__container">
    <span style="display: inline-block">
      <font-awesome-icon
        :class="{ 'modal-tooltip__icon--hover': isHoveringImpl }"
        :icon="['far', 'square-info']"
        style="margin-top: 3px; margin-left: -18px; font-size: 18px; color: #ddd; cursor: pointer"
        @click.stop="enableTooltip"
        title="Click for Details about this Metric"
      />
      <v-dialog
        origin="left center"
        :content-class="`modal-tooltip__dialog--${cell.id}`"
        :hide-overlay="true"
        v-model="shouldShowDialog"
        max-width="500px"
        width="50%"
        @input="v => v || stopVideo()"
      >
        <v-card flat>
          <v-card-title class="modal-tooltip__v-card--title">
            <span class="modal-tooltop__title--font">{{ title }}</span>
            <v-spacer></v-spacer>
            <span class="modal-tooltip__title--close">
              <font-awesome-icon
                :icon="['fal', 'times']"
                style="cursor: pointer; font-size: 18px"
                @click="
                  stopVideo()
                  shouldShowDialog = false
                "
              />
            </span>
          </v-card-title>
          <v-card-text>
            <span v-if="contentKind === plaintextContentKind">{{ content }} </span>
            <span v-else v-html="content" ref="hoverHtml"></span>
          </v-card-text>
        </v-card>
      </v-dialog>
    </span>
  </span>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Action, namespace, State } from 'vuex-class'

import { ComponentBase, HoverContentKind, TreeTableCell } from '@vuescape/index'
import { ModuleState, ns, StoreOperation } from '@vuescape/store/modules'

@Component({})
export default class Tooltip extends ComponentBase {
  private shouldShowDialog = false

  @State('tooltipSingleton')
  private tooltipSingleton: ModuleState<Array<boolean>>

  @namespace('tooltipSingleton').State((state: ModuleState<Array<boolean>>) => state.value)
  private tooltipSingletonValue: Array<boolean>

  @namespace('tooltipSingleton').Mutation(StoreOperation.Mutation.SET_VALUE)
  private setTooltipSingleton: (val: Array<boolean>) => void

  @Prop({ type: Object, required: true })
  private cell: TreeTableCell

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean

  private isHoveringImpl = false

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

  private get content() {
    return this.cell.hover ? this.cell.hover.content : ''
  }

  private get contentKind() {
    return this.cell.hover ? this.cell.hover.contentKind : HoverContentKind.None
  }

  private get plaintextContentKind() {
    return HoverContentKind.Plaintext
  }

  private async enableTooltip() {
    this.setTooltipSingleton([false])
    await this.$nextTick()
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
.modal-tooltip__v-card--title {
  /* background-color: #16a5c6 !important;
  color: #ffffff; */
  font-size: 17px;
  font-weight: 400;
  padding-right: 8px;
  align-content: baseline;
}
.modal-tooltop__title--font {
  font-weight: 500;
  width: 90% !important;
}
.modal-tooltip__title--close {
  position: absolute;
  right: 8px;
  top: 4px;
}
.modal-tooltip__icon--hover {
  color: #16a5c6 !important;
}
.modal-tooltip__container {
  margin-left: 13px;
}
</style>
