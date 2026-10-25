<template>
  <v-menu location="bottom start">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        class="download-button__v-btn--style"
        variant="outlined"
        size="small"
      >
        <i
          class="download-button__v-icon--font download-menu__v-icon--dropdown fa-duotone fa-cloud-download-alt"
          style="color: #555; margin-right: 7px;"
        />download &nbsp;
        <v-icon
          class="download-menu__v-icon--dropdown"
          style="font-size: 10px; font-weight: bolder;"
          size="small"
        >fa-solid fa-caret-down
        </v-icon>
      </v-btn>
    </template>
    <v-list class="download-menu__v-list--layout">
      <v-list-item
        v-if="shouldDisplayChart"
        @click="clickHandlers.clickChart"
      >
        <template v-slot:prepend>
          <v-list-item-action class="download-menu__v-list-tile-action--layout">
            <i
              class="download-button__v-icon--font fa-duotone fa-file-image"
              style="color: #555;"
            />
          </v-list-item-action>
        </template>
        <div class="download-menu__v-list-tile-content--layout">
          <v-list-item-title>Chart</v-list-item-title>
        </div>
      </v-list-item>
      <v-list-item
        v-if="shouldDisplayExcel"
        @click="clickHandlers.clickExcel"
      >
        <template v-slot:prepend>
          <v-list-item-action class="download-menu__v-list-tile-action--layout">
            <i
              class="download-button__v-icon--font fa-duotone fa-file-excel"
              style="color: #555;"
            />
          </v-list-item-action>
        </template>

        <div class="download-menu__v-list-tile-content--layout">
          <v-list-item-title>Excel</v-list-item-title>
        </div>
      </v-list-item>
      <v-list-item
        v-if="shouldDisplayCsv"
        @click="clickHandlers.clickCsv"
      >
        <template v-slot:prepend>
          <v-list-item-action class="download-menu__v-list-tile-action--layout">
            <i
              class="download-button__v-icon--font fa-duotone fa-file-csv"
              style="color: #555;"
            />
          </v-list-item-action>
        </template>

        <div class="download-menu__v-list-tile-content--layout">
          <v-list-item-title>CSV</v-list-item-title>
        </div>
      </v-list-item>
      <v-list-item
        v-if="shouldDisplayPdf"
        @click="clickHandlers.clickPdf"
      >
        <template v-slot:prepend>
          <v-list-item-action class="download-menu__v-list-tile-action--layout">
            <i
              class="download-button__v-icon--font fa-duotone fa-file-pdf"
              style="color: #555;"
            />
          </v-list-item-action>
        </template>
        <div class="download-menu__v-list-tile-content--layout">
          <v-list-item-title>PDF</v-list-item-title>
        </div>
      </v-list-item>
      <v-list-item
        v-if="shouldDisplayZip"
        @click="clickHandlers.clickZip"
      >
        <template v-slot:prepend>
          <v-list-item-action class="download-menu__v-list-tile-action--layout">
            <i
              class="download-button__v-icon--font fa-duotone fa-file-archive"
              style="color: #555;"
            />
          </v-list-item-action>
        </template>
        <div class="download-menu__v-list-tile-content--layout">
          <v-list-item-title>{{ zipText || 'Zip' }}</v-list-item-title>
        </div>
      </v-list-item>
      <v-list-item
        v-if="shouldDisplayRaw"
        @click="clickHandlers.clickRaw"
      >
        <template v-slot:prepend>
          <v-list-item-action class="download-menu__v-list-tile-action--layout">
            <i
              class="download-button__v-icon--font fa-duotone fa-file-code"
              style="color: #555;"
            />
          </v-list-item-action>
        </template>
        <div class="download-menu__v-list-tile-content--layout">
          <v-list-item-title>Raw</v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

@Component({})
class DownloadMenu extends Vue {
  @Prop({ type: Boolean, default: false })
  private shouldDisplayRaw: boolean
  @Prop({ type: Boolean, default: false })
  private shouldDisplayExcel: boolean
  @Prop({ type: Boolean, default: true })
  private shouldDisplayCsv: boolean
  @Prop({ type: Boolean, default: true })
  private shouldDisplayPdf: boolean
  @Prop({ type: Boolean, default: true })
  private shouldDisplayChart: boolean
  @Prop({ type: Boolean, default: false })
  private shouldDisplayZip: boolean
  @Prop({ type: String, default: '' })
  private zipText: string
  @Prop({ type: Object, required: true })
  private clickHandlers: {
    clickChart?: () => void
    clickCsv?: () => void
    clickPdf?: () => void
    clickZip?: () => void, clickExcel?: () => void, clickRaw?: () => void,
  }
}

export default toNative(DownloadMenu)
</script>

<style>
.download-button__v-btn--style {
  margin-bottom: 0;
  font-size:     11px;
  border-color:  #dddddd !important;
  /* margin-top: -4px; */
  border-radius: 5px;
  height:        24px;
}
.download-button__v-icon--font {
  font-size: 15px;
  vertical-align: text-bottom;
}
.download-menu__v-icon--dropdown {
  margin-top: 2px !important;
}
.download-menu__v-list--layout {
  padding-top:    0;
  padding-bottom: 0;
}
div.download-menu__v-list--layout .v-list-item {
  min-height: 24px;
  height:     24px;
  max-height: 24px;
}
.download-menu__v-list-tile-action--layout {
  margin-left: -3.6px;
}
.download-menu__v-list-tile-content--layout {
  font-size: 11px;
  color:     rgb(136, 136, 136);
}
.download-menu__v-list-tile-content--layout .v-list-item-title {
  font-size: inherit;
}
</style>
