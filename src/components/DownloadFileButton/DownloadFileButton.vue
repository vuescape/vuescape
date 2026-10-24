<template>
  <div>
    <vuescape-button
      :color="color"
      :icons="icons"
      :isDisabled="isButtonDisabled"
      Depressed
      @click="click"
    >
      <slot> Download CSV</slot>
    </vuescape-button>
    <v-snackbar
      v-model="shouldShowDownloadCompleted"
      :timeout="60000"
      attach
      contained
      color="primary"
      location="bottom end"
    >
      <i class="fa-duotone fa-check-circle"></i>&nbsp;&nbsp; Your file is downloading
      <template v-slot:actions>
        <v-btn
          color="primary"
          @click="shouldShowDownloadCompleted = false"
          variant="text"
        >Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="shouldShowDownloadCsvMessage"
      :timeout="10000"
      absolute
      location="bottom end"
    >
      Your file is being prepared for download.
      <template v-slot:actions>
        <v-btn
          color="primary"
          @click="shouldShowDownloadCsvMessage = false"
          variant="text"
        >Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue, Watch } from '@vuescape/decorators'
import { defineAsyncComponent } from 'vue'


import { decodeBase64String, downloadFile } from '@vuescape/infrastructure'

const VuescapeButton = defineAsyncComponent(() => import(/* webpackChunkName: 'vuescape-button' */ '@vuescape/components/VuescapeButton/').then(
  m => m.default))

@Component({
  components: { VuescapeButton },
})
class DownloadFileButton extends Vue {
  @Prop({ default: false })
  private isBase64EncodedBinary: boolean
  // Make this a function because we want it to be reactive
  @Prop({ type: Boolean, default: true })
  private isDisabled: boolean
  @Prop({ default: 'primary' })
  private color: string
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

  private isButtonDisabled            = true
  private shouldShowDownloadCompleted = false

  @Watch('isDisabled')
  private isDisabledWatcher(val: boolean, oldVal: boolean) {
    this.isButtonDisabled = val
  }

  private createFilename() {
    if (this.getFilename !== undefined) {
      return this.getFilename()
    }
    const now      = new Date()
    const filename = `${this.filenamePrefix}_${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(
      -2)}.csv`
    return filename
  }

  private async click() {
    if (this.shouldShowCompletedMessage) {
      const component = this
      setTimeout(() => {
        component.shouldShowDownloadCompleted = true
      }, 200)
    }

    await this.onClick()
    // If not uses Vuex and updating data in the onClick function then will need
    // to call nextTick to allow changes to the data property to propagate.
    await this.$nextTick()

    const data = this.isBase64EncodedBinary ? decodeBase64String(this.data) : this.data
    downloadFile(data, this.createFilename(), this.shouldAddByteOrderMark)
    if (this.shouldShowCompletedMessage) {
      const component = this
      setTimeout(() => {
        component.shouldShowDownloadCompleted = false
      }, 1000)
    }
  }

  private created() {
    this.isButtonDisabled = this.isDisabled
  }
}

export default toNative(DownloadFileButton)
</script>
