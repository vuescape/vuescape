<template>
  <span class="modal-tooltip__container">
    <span
      :title="hintText"
      style="display: inline-block"
      @click.stop="enableTooltip"
    >
      <i
        :class="[{ 'modal-tooltip__icon--hover': isHoveringImpl }, icons.join(' ')]"
        :style="iconStyleObject"
      ></i>
      <v-dialog
        v-model="shouldShowDialog"
        :content-class="`modal-tooltip__dialog--${cell.id}`"
        :hide-overlay="true"
        max-width="maxWidthValue"
        origin="left center"
        :width="widthValue"
        @input="v => v || stopVideo()"
      >
        <v-card flat>
          <v-card-title class="modal-tooltip__v-card--title">
            <span class="modal-tooltop__title--font">{{ title }}</span>
            <v-spacer></v-spacer>
            <span
              class="modal-tooltip__title--close"
              style="cursor: pointer; font-size: 18px"
              @click="
                  stopVideo()
                  shouldShowDialog = false
                "
            >
              <i
                class="fa-light fa-times"
              ></i>
            </span>
          </v-card-title>
          <v-card-text>
            <span v-if="contentKind === plaintextContentKind">{{ content }} </span>
            <span
              v-else
              ref="hoverHtml"
              v-html="content"
            ></span>
          </v-card-text>
        </v-card>
      </v-dialog>
    </span>
  </span>
</template>
<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

import { ComponentBase, HoverContentKind, TreeTableCell } from '@vuescape/index'
import { ModuleState, StoreOperation } from '@vuescape/store/modules'

@Component({})
export default class Tooltip extends ComponentBase {
  private shouldShowDialog = false
  private maxWidthValue = ''
  private widthValue = ''

  @State('tooltipSingleton') private tooltipSingleton: ModuleState<Array<boolean>>

  @namespace('tooltipSingleton')
    .State((state: ModuleState<Array<boolean>>) => state.value) private tooltipSingletonValue: Array<boolean>

  @namespace('tooltipSingleton')
    .Mutation(StoreOperation.Mutation.SET_VALUE) private setTooltipSingleton: (val: Array<boolean>) => void

  @Prop({
    type    : Object,
    required: true,
  }) private cell: TreeTableCell

  @Prop({
    type   : Boolean,
    default: false,
  }) private isHovering: boolean

  @Prop({
    type   : String,
    default: 'Click for Details about this Metric',
  }) private hintText: boolean

  @Prop({
    type   : Array,
    default: () => ['fa-regular', 'fa-square-info'],
  }) private icons: Array<string>

  @Prop({
    type   : Object,
    default: () => ({
      'margin-top'    : '3px',
      'margin-left'   : '-18px',
      'font-size'     : '18px',
      color           : '#ddd',
      cursor          : 'pointer',
      'vertical-align': 'bottom',
    }),
  }) private iconStyleObject: boolean

  @Prop({
    type   : String,
    required: false,
  }) private maxWidth: string

  private isHoveringImpl = false

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

    // If no maxWidth is set, set default values
    if (!this.maxWidth) {
      this.maxWidthValue = '500px'
      this.widthValue = '50%'
    } else {
      this.widthValue = 'auto!important'
    }

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
  font-size:     17px;
  font-weight:   400;
  padding-right: 8px;
  align-content: baseline;
}
.modal-tooltop__title--font {
  font-weight: 500;
  width:       90% !important;
}
.modal-tooltip__title--close {
  position: absolute;
  right:    8px;
  top:      4px;
}
.modal-tooltip__icon--hover {
  color: #16a5c6 !important;
}
.modal-tooltip__container {
  margin-left: 13px;
}
</style>
