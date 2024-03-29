<template>
  <v-card
    flat
    hover
    style="border: 2px dashed #9bdddb; text-align: center; height: 100%; text-align: center;"
    :style="files.length === 0 ? 'cursor: pointer;' : 'cursor : unset;'"
    @click="files.length === 0 && $refs.fileInput.click()"
  >
    <input
      accept=".xlsx"
      ref="fileInput"
      style="display: none;"
      type="file"
      multiple
      @change="filesChanged"
    />
    <div
      v-if="files.length === 0"
      @drop.prevent="dropFiles"
      @dragover.prevent
    >
      <v-card-title style="display: inline-block;">
        <span class="file-upload__span--title">Drag and drop or click to choose your Excel survey file.</span>
      </v-card-title>
      <v-card-text>
        <i
          class="vuescape-button__v-icon--font fa-duotone fa-cloud-upload-alt"
          style="color: #555; font-size: 120px;"
        />
      </v-card-text>
    </div>
    <div
      v-if="files.length > 0"
      style="cursor: unset;"
      @click.prevent.stop=""
    >
      <v-layout row>
        <v-flex xs12>&nbsp;</v-flex>
      </v-layout>
      <v-list>
        <v-list-tile
          v-for="file in files"
          :key="file.name"
        >
          <v-list-tile-action>
            <i
              class="vuescape-button__v-icon--font fa-duotone file-excel"
              style="color: #555; font-size: 40px;"
            />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="file.name"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-avatar>
            <span
              style="cursor: pointer;"
              @click.stop="remove(file.name)"
            >
              <i
                class="vuescape-button__v-icon--font file-upload__close fa-light fa-times-square"
                style="color: #555; font-size: 25px;"
              />
            </span>
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
      <v-layout row>
        <v-flex xs12>&nbsp;</v-flex>
      </v-layout>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

const VuescapeButton = () =>
  import(/* webpackChunkName: 'vuescape-button' */ '@vuescape/components/VuescapeButton/').then(m => m.default)

@Component({ components: { VuescapeButton } })
export default class FileUpload extends Vue {
  @Prop({ type: String, required: false, default: 'Select an Item' })
  private label: string
  @Prop({ type: String, required: false, default: 'No Items Found' })
  private noDataText: string
  @Prop({ type: Function, required: false })
  private filterFunction: (item: any, queryText: string) => boolean
  @Prop({ type: Array, required: false, default: () => ['id', 'name'] })
  private filterProperties: Array<string>
  @Prop({ type: Function, required: false })
  private beforeFilter: any

  private files: Array<any> = []

  private remove(fileName: string) {
    const fileInput = this.$refs.fileInput as any
    fileInput.value = ''
    this.files      = this.files.filter((file: any) => {
      return file.name !== fileName
    })
  }

  private dropFiles(e: any) {
    const droppedFiles = e.dataTransfer.files
    if (!droppedFiles) {
      return
    }
    this.files = Array.from(droppedFiles)
  }

  private filesChanged(event: any) {
    if (event.target.files.length === 0) {
      return
    }
    this.files = Array.from(event.target.files)
  }

  @Watch('files')
  private onFilesChanged(val: Array<any>, oldVal: Array<any>) {
    this.$emit('can-continue', { value: val.length !== 0 })
    this.$emit('filesSelected', { files: this.files })
  }

  private activated() {
    this.onFilesChanged(this.files, this.files)
  }
}
</script>

<style>
.file-upload__close:hover {
  background-color: #f5f5f5;
}
.file-upload__span--title {
  font-size:      20px;
  font-weight:    400;
  line-height:    1 !important;
  letter-spacing: 0.02em !important;
}
.v-list__tile:hover {
  background-color: rgb(235, 248, 240);
  padding-left:     16px;
  padding-right:    16px;
}
</style>
