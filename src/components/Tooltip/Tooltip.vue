<template>
  <span class="tooltip__container">
    <span style="width: 14px; display: inline-block;" v-show="!isHoveringImpl"></span>
    <v-menu
      :content-class="cell.id"
      v-model="shouldShowDialog"
      :close-on-content-click="false"
      top
      right
      :nudge-top="30"
      :nudge-right="10"
      max-width="500"
      transition="scale-transition"
      origin="bottom left"
    >
      <template v-slot:activator="{ on }">
        <font-awesome-icon
          v-show="isHoveringImpl"
          :icon="['far', 'question-circle']"
          style="font-size: 14px; color: #16a5c6; cursor: pointer;"
          @click.stop="enableTooltip"
          v-on="on"
        />
      </template>

      <v-card flat>
        <v-card-title class="tooltip__v-card--title">
          <span class="tooltop__title--font">{{ title }}</span
          ><v-spacer></v-spacer>
          <span class="tooltip__title--close">
            <font-awesome-icon
              :icon="['fal', 'times']"
              style="cursor: pointer; font-size: 18px;"
              @click="
                stopVideo()
                shouldShowDialog = false
              "
          /></span>
          <!-- <span @click="shouldShowDialog = false">X</span> -->
        </v-card-title>
        <v-card-text>
          <span v-if="text">{{ text }} </span>
          <span v-else v-html="html" ref="hoverHtml"></span>
        </v-card-text>
      </v-card>
    </v-menu>
  </span>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Action, namespace, State } from 'vuex-class'

import { ComponentBase, TreeTableItem } from '@vuescape/index'
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

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean

  @Prop({ type: String, default: '50%' })
  private clientX: string

  @Prop({ type: String, default: '50%' })
  private clientY: string

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

  private get text() {
    return this.cell.hover ? this.cell.hover.text : ''
  }

  private get html() {
    return this.cell.hover ? this.cell.hover.html : ''
  }

  private positionDialog() {
    const dialogs = document.querySelectorAll('.v-dialog')
    const dialogArray = [...dialogs]
    const dialog = dialogArray.filter(_ => {
      if (_.children[0] && _.children[0].children[0] && _.children[0].children[0].children[0]) {
        const title = _.children[0].children[0].children[0] as any
        return title.innerText === this.cell.value
      }
      return false
    })
    if (dialog.length) {
      const dialogToChange = dialog[0] as any
      dialogToChange.style.position = 'absolute'
      dialogToChange.style.left = this.clientX
      dialogToChange.style.top = this.clientY
    }
  }

  private async enableTooltip() {
    this.setTooltipSingleton([false])
    await this.$nextTick()
    // this.positionDialog()
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
/* .v-dialog {
  position: absolute;
  left: 0;
  top: 0;
} */
.tooltip__v-card--title {
  /* background-color: #16a5c6 !important;
  color: #ffffff; */
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
