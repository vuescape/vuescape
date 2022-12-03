<template>
  <div>
    <vuescape-button :color="color" :data="data" :icons="icons" :isDisabled="isButtonDisabled" Depressed @click="click">
      <slot> Download CSV</slot>
    </vuescape-button>
    <v-snackbar v-model="shouldShowDownloadCompleted" :timeout="10000" bottom color="primary" right>
      <font-awesome-icon :icon="['fad', 'check-circle']"></font-awesome-icon>&nbsp;&nbsp; Your file is downloading
      <v-btn color="primary" flat @click="shouldShowDownloadCompleted = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="shouldShowDownloadCsvMessage" :bottom="true" :right="true" :timeout="10000">
      Your file is being prepared for download.
      <v-btn color="primary" flat @click="shouldShowDownloadCsvMessage = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Component, Prop, Watch } from 'vue-property-decorator'

import { decodeBase64String, downloadFile } from '@vuescape/infrastructure'

const VuescapeButton = () =>
  import(/* webpackChunkName: 'vuescape-button' */ '@vuescape/components/VuescapeButton/').then(m => m.default)

@Component({
  components: { VuescapeButton },
})
export default class DownloadFileButton extends Vue {
  @Prop({ default: false })
  private isBase64EncodedBinary: boolean
  // Make this a function because we want it to be reactive
  @Prop({ type: Boolean, default: true })
  private isDisabled: boolean
  @Prop({ default: 'primary' })
  private color: string
  // tslint:disable-next-line:no-empty
  @Prop({
    default: () => { /* no-op */
    },
  })
  private onClick: () => void
  @Prop()
  private data: string
  @Prop()
  private getFilename: () => string
  @Prop({ default: true })
  private shouldShowCompletedMessage: boolean
  @Prop({ default: false })
  private shouldShowDownloadCsvMessage: boolean
  @Prop({ default: 'download' })
  private filenamePrefix: string
  @Prop({ type: Array, required: false, default: () => [] })
  private icons: Array<string>
  @Prop({ default: false })
  private shouldAddByteOrderMark: boolean

  private isButtonDisabled = true
  private shouldShowDownloadCompleted = false

  @Watch('isDisabled')
  private isDisabledWatcher(val: boolean, oldVal: boolean) {
    this.isButtonDisabled = val
  }

  private createFilename() {
    if (this.getFilename !== undefined) {
      return this.getFilename()
    }
    const now = new Date()
    const filename = `${this.filenamePrefix}_${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${(
      '0' + now.getDate()
    ).slice(-2)}.csv`
    return filename
  }

  private async click() {
    await this.onClick()
    // If not uses Vuex and updating data in the onClick function then will need
    // to call nextTick to allow changes to the data property to propagate.
    await this.$nextTick()

    const data = this.isBase64EncodedBinary ? decodeBase64String(this.data) : this.data
    downloadFile(data, this.createFilename(), this.shouldAddByteOrderMark)

    if (this.shouldShowCompletedMessage) {
      const component = this
      setTimeout(() => {
        component.shouldShowDownloadCompleted = true
      }, 200)
    }
  }

  private created() {
    this.isButtonDisabled = this.isDisabled
  }
}
</script>
