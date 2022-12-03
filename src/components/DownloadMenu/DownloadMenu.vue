<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        small
        outline
        depressed
        color="primary"
        class="download-button__v-btn--style"
      >
        <font-awesome-icon
          :icon="['fad', 'cloud-download-alt']"
          class="download-button__v-icon--font"
          :style="{ color: '#555', marginRight: '7px;' }"
        />&nbsp; download &nbsp;
        <v-icon
          small
          class="download-menu__v-icon--dropdown"
        >fas fa-caret-down
        </v-icon>
      </v-btn>
    </template>
    <v-list class="download-menu__v-list--layout">
      <v-list-tile
        v-if="shouldDisplayChart"
        @click="clickHandlers.clickChart"
      >
        <v-list-tile-action class="download-menu__v-list-tile-action--layout">
          <font-awesome-icon
            :icon="['fad', 'file-image']"
            class="download-button__v-icon--font"
            :style="{ color: '#555' }"
          />
        </v-list-tile-action>
        <v-list-tile-content class="download-menu__v-list-tile-content--layout">
          <v-list-tile-title>Chart</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-if="shouldDisplayExcel"
        @click="clickHandlers.clickExcel"
      >
        <v-list-tile-action class="download-menu__v-list-tile-action--layout">
          <font-awesome-icon
            :icon="['fad', 'file-excel']"
            class="download-button__v-icon--font"
            :style="{ color: '#555' }"
          />
        </v-list-tile-action>

        <v-list-tile-content class="download-menu__v-list-tile-content--layout">
          <v-list-tile-title>Excel</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-if="shouldDisplayCsv"
        @click="clickHandlers.clickCsv"
      >
        <v-list-tile-action class="download-menu__v-list-tile-action--layout">
          <font-awesome-icon
            :icon="['fad', 'file-download']"
            class="download-button__v-icon--font"
            :style="{ color: '#555' }"
          />
        </v-list-tile-action>

        <v-list-tile-content class="download-menu__v-list-tile-content--layout">
          <v-list-tile-title>CSV</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-if="shouldDisplayPdf"
        @click="clickHandlers.clickPdf"
      >
        <v-list-tile-action class="download-menu__v-list-tile-action--layout">
          <font-awesome-icon
            :icon="['fad', 'file-pdf']"
            class="download-button__v-icon--font"
            :style="{ color: '#555' }"
          />
        </v-list-tile-action>
        <v-list-tile-content class="download-menu__v-list-tile-content--layout">
          <v-list-tile-title>PDF</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-if="shouldDisplayZip"
        @click="clickHandlers.clickZip"
      >
        <v-list-tile-action class="download-menu__v-list-tile-action--layout">
          <font-awesome-icon
            :icon="['fad', 'file-archive']"
            class="download-button__v-icon--font"
            :style="{ color: '#555' }"
          />
        </v-list-tile-action>
        <v-list-tile-content class="download-menu__v-list-tile-content--layout">
          <v-list-tile-title>{{ zipText || 'Zip' }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-if="shouldDisplayRaw"
        @click="clickHandlers.clickRaw"
      >
        <v-list-tile-action class="download-menu__v-list-tile-action--layout">
          <font-awesome-icon
            :icon="['fad', 'file-code']"
            class="download-button__v-icon--font"
            :style="{ color: '#555' }"
          />
        </v-list-tile-action>
        <v-list-tile-content class="download-menu__v-list-tile-content--layout">
          <v-list-tile-title>Raw</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class DownloadMenu extends Vue {
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
    clickZip?: () => void,
    clickExcel?: () => void,
    clickRaw?: () => void,
  }
}
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
  /* margin-top: -1px; */
}
.download-menu__v-icon--dropdown {
  font-size:  10px !important;
  margin-top: 2px !important;
}
.download-menu__v-list--layout {
  padding-top:    0;
  padding-bottom: 0;
}
div.download-menu__v-list--layout a.v-list__tile {
  height:     24px;
  max-height: 24px;
}
.download-menu__v-list-tile-action--layout {
  margin-left: -3.6px;
}
.download-menu__v-list-tile-content--layout {
  font-size:   11px;
  color:       rgb(136, 136, 136);
  margin-left: -35px;
}
</style>
