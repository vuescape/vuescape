<template>
  <div>
    <v-btn
      :disabled="isButtonDisabled"
      Depressed
      @click="click"
      :color="color"
      :data="data"
    >
      <slot>
        Download CSV
      </slot>
    </v-btn>
    <v-snackbar
      :timeout="10000"
      bottom
      right
      v-model="shouldShowDownloadCompleted"
    >
      <v-icon dark>check_circle</v-icon>&nbsp;&nbsp; Your file is downloading.
      <v-btn
        flat
        color="primary"
        @click="shouldShowDownloadCompleted = false"
      >Close</v-btn>
    </v-snackbar>
    <v-snackbar
      :timeout="10000"
      :bottom="true"
      :right="true"
      v-model="shouldShowDownloadCsvMessage"
    >
      Your file is being prepared for download.
      <v-btn
        flat
        color="primary"
        @click="shouldShowDownloadCsvMessage = false"
      >Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import FileSaver from 'file-saver'
import Vue from 'vue'
import { Action, State } from 'vuex-class'

import { Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class DownloadFileButton extends Vue {
  @Prop({ default: false })
  private isBase64EncodedBinary: boolean
  // Make this a function because we want it to be reactive
  @Prop({ type: Boolean, default: true })
  private isDisabled: boolean
  @Prop({ default: 'primary' })
  private color: string
  // tslint:disable-next-line:no-empty
  @Prop({ default: () => {} })
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

  private isButtonDisabled = this.isDisabled
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
    if (this.data) {
      let downloadedData: Uint8Array | string = this.data + '\n\n'
      if (this.isBase64EncodedBinary) {
        const byteCharacters = atob(this.data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        downloadedData = new Uint8Array(byteArray)
      }
      const blob = new Blob([downloadedData], { type: 'application/octet-stream; charset=utf-8' })
      FileSaver.saveAs(blob, this.createFilename())

      if (this.shouldShowCompletedMessage) {
        const component = this
        setTimeout(() => {
          component.shouldShowDownloadCompleted = true
        }, 200)
      }
    }
  }
}
</script>
