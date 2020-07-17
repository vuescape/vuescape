<template>
  <span class="tooltip__container">
    <font-awesome-icon
      :icon="['fal', 'info-circle']"
      style="font-size: 14px; color: #16a5c6; cursor: pointer;"
      class="legend-table__font-awesome-icon--style"
      @click.stop="enableTooltip"
    />
    <v-dialog :hide-overlay="true" v-model="shouldShowDialog" max-width="400" @input="v => v || stopVideo()">
      <v-card flat class="fixed-cell-renderer__card--hover">
        <v-card-title class="tooltip__v-card--title">
          <span class="title font-weight-light">{{ title }}</span
          ><v-spacer></v-spacer>
          <font-awesome-icon
            :icon="['fal', 'times']"
            style="cursor: pointer; font-size: 18px;"
            @click="
              stopVideo()
              shouldShowDialog = false
            "
          />
          <!-- <span @click="shouldShowDialog = false">X</span> -->
        </v-card-title>
        <v-card-text>
          <span v-if="text">{{ text }} </span>
          <span v-else v-html="html" ref="hoverHtml"></span>
        </v-card-text>
      </v-card>
    </v-dialog>
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
  private clientX: string = '50%'
  private clientY: string = '50%'

  @State('tooltipSingleton')
  private tooltipSingleton: ModuleState<Array<boolean>>

  @(namespace('tooltipSingleton').State((state: ModuleState<Array<boolean>>) => state.value))
  private tooltipSingletonValue: Array<boolean>

  @(namespace('tooltipSingleton').Mutation(StoreOperation.Mutation.SET_VALUE))
  private setTooltipSingleton: (val: Array<boolean>) => void

  @Prop({ type: Object, required: true })
  private cell: TreeTableItem

  @Prop({ type: String, required: true })
  private x: string

  @Prop({ type: String, required: true })
  private y: string

  @Watch('x')
  private onxChanged(newValue: string, oldValue: string) {
    this.clientX = newValue
  }

  @Watch('y')
  private onyChanged(newValue: string, oldValue: string) {
    this.clientY = newValue
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
    debugger
    const dialogs = document.querySelectorAll('.v-dialog')
    const dialogArray = [...dialogs]
    const dialog = dialogArray.filter(_ => {
      debugger
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

  private beforeDestory() {
    this.stopVideo()
  }

  private created() {
    this.clientX = this.x
    this.clientY = this.y

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
  font-weight: 300;
}
.legend-table__div--spaced {
  background: white;
  padding: 10px;
}
.legend-table__font-awesome-icon--style {
  color: #bbbbbb;
  font-size: 14px;
  margin-right: 0px;
}
.legend-table__v-btn--style {
  border: 1px solid #dddddd !important;
  border-radius: 5px;
  height: 24px;
  width: 24px;
  padding-left: 8px;
  padding-right: 8px;
  margin-top: 6px;
  margin-right: 6px;
}
table.legend-table__table--legend thead td {
  border: 0px;
  background-color: #16a5c6 !important;
  color: #ffffff;
  text-align: center;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  padding-right: 20px;
  padding-left: 20px;
  border-bottom-color: rgb(85, 85, 85);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
table.legend-table__table--legend tbody td {
  padding-left: 10px;
  padding-right: 10px;
}
table.legend-table__table--legend {
  border-collapse: collapse;
  /* font-family: 'Segoe UI'; */
  padding: 10px;
}
table.legend-table__table--legend tr {
  height: 28px;
  min-width: 100px;
}
table.legend-table__table--legend tr:last-child {
  border-bottom-color: rgb(85, 85, 85);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
table.legend-table__table--legend thead td {
  font-size: 13px;
  border: 0px;
  background-color: #16a5c6 !important;
  color: #ffffff;
  text-align: center;
  height: 32px;
  font-weight: 500;
  padding-right: 20px;
  padding-left: 20px;
  border-bottom-color: rgb(85, 85, 85);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
table.legend-table__table--legend tbody td {
  padding-left: 10px;
  padding-right: 10px;
  font-size: 13px;
}
</style>
