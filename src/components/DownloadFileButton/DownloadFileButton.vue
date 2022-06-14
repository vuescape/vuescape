<template>
  <div>
    <vuescape-button :icons="icons" :isDisabled="isButtonDisabled" Depressed @click="click" :color="color" :data="data">
      <slot> Download CSV </slot>
    </vuescape-button>
    <v-snackbar color="primary" :timeout="10000" bottom right v-model="shouldShowDownloadCompleted">
      <font-awesome-icon :icon="['fad', 'check-circle']"></font-awesome-icon>&nbsp;&nbsp; Your file is downloading
      <v-btn flat color="primary" @click="shouldShowDownloadCompleted = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="10000" :bottom="true" :right="true" v-model="shouldShowDownloadCsvMessage">
      Your file is being prepared for download.
      <v-btn flat color="primary" @click="shouldShowDownloadCsvMessage = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Component, Prop, Watch } from 'vue-property-decorator'

import { downloadFile } from '@vuescape/infrastructure'

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
  @Prop({ type: Array, required: false, default: () => [] })
  private icons: Array<string>

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

    downloadFile(this.data, this.isBase64EncodedBinary, this.createFilename())

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
