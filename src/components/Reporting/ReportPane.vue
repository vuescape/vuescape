<template>
  <div
    :style="divStyle"
    :key="reportNamespace"
    class="report-pane__container--layout"
  >

    <div :ref="reportHeaderRef">
      <v-layout
        align-start
        fill-height
        justify-start
        row
        benchmarking-report__v-layout--margin
      >
        <v-flex
          lg12
          md12
          xs12
        >
          <div class="report-pane__header--title">

            {{ reportTitle }}
          </div>
        </v-flex>
      </v-layout>
      <v-layout
        row
        style="white-space: nowrap;"
      >
        <v-flex xs11>
          <v-btn-toggle
            v-if="report && report.sections && report.sections.length > 1"
            style="text-align: left!important;box-shadow: unset"
            v-model="selectedSectionId"
            mandatory
          >
            <v-btn
              v-for="section in report.sections"
              :key="section.id + '-toggle'"
              active-class="report-pane__v-btn--active"
              class="report-pane__v-btn--inactive"
              flat
              color="black"
              :value="section.id"
            >{{ section.name }}</v-btn>
          </v-btn-toggle>
        </v-flex>
        <v-spacer></v-spacer>
        <span class="report-pane__span--additional-info">{{ report.additionalReportInfo }}</span>
        <span class="exclude-from-pdf report-pane__span--menu">
          <download-menu
            v-if="shouldDisplayDownloadMenu"
            :shouldDisplayPdf="false"
            :shouldDisplayChart="false"
            :shouldDisplayCsv="shouldDisplayCsvDownload"
            :clickHandlers="{ clickCsv: downloadCsv }"
          ></download-menu>
        </span>
      </v-layout>
    </div>
    <tree-table
      v-if="selectedSection.id"
      :id="selectedSection.treeTable.id"
      :ref="treeTableReference"
      :key="selectedSection.id"
      :headers="selectedSection.treeTable.content.headers"
      :footers="selectedSection.treeTable.content.footers"
      :rows="selectedSection.treeTable.content.rows"
      :columnDefinitions="selectedSection.treeTable.columnDefinitions"
      :shouldFreezeFirstColumn="selectedSection.treeTable.content.shouldFreezeFirstColumn"
      :shouldIncludeFooter="selectedSection.treeTable.content.shouldIncludeFooter"
      :sortLevel="selectedSection.treeTable.content.sortLevel"
      :cssStyles="selectedSection.treeTable.content.cssStyles"
      :cssClass="selectedSection.treeTable.content.cssClass"
    ></tree-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'

import { getModuleStateByKey, makeStateKey } from '@vuescape/store/storeHelpers'

import { SlidingPaneAction, SlidingPaneConfig, SlidingPaneEvent } from '@vuescape/components/SlidingPanes'
import { ComponentBase, Section } from '@vuescape/index'
import { Link, ResourceKind } from '@vuescape/reporting-domain'

const DownloadMenu = () =>
  import(/* webpackChunkName: 'download-button' */ '@vuescape/components/DownloadMenu').then(m => m.default)
const TreeTable = () =>
  import(/* webpackChunkName: 'tree-table' */ '@vuescape/components/TreeTable-v2/').then(m => m.default)

@Component({
  components: { DownloadMenu, TreeTable },
})
export default class ReportPane extends ComponentBase {
  private selectedSection = { id: '', title: '', name: '' }

  private shouldRender = true
  private isDestroyed = false
  // Props passed in on route
  @Prop({ type: String, required: true })
  private reportNamespace: string

  @Prop({ type: String, default: '' })
  private divStyle: string

  private get shouldDisplayDownloadMenu() {
    const result = this.report && this.report.downloadLinks && this.report.downloadLinks.length > 0
    return result
  }

  private get reportHeaderRef() {
    return 'reportPaneHeader-' + this.reportNamespace
  }
  // TODO: pass in value? or just lookup CSV?
  private downloadCsv() {
    if (!this.shouldDisplayCsvDownload) {
      return
    }

    // make the call to get the data
    // do the download thing
  }

  private get shouldDisplayCsvDownload() {
    const result = this.shouldDisplayDownloadMenu && 
                   this.report.downloadLinks.some((_ : Link) => _.resourceKind === ResourceKind.Csv)
    return result
  }

  private get report() {
    const state = getModuleStateByKey(this.reportNamespace, this.$store)
    const result = state?.value
    return result
  }

  private get reportTitle() {
    let result = this.report.title
    if (this.selectedSection?.title) {
      result += ' | ' + this.selectedSection.title
    }

    return result
  }

  private get treeTableReference() {
    const result = `${this.reportNamespace}-${this.selectedSection.id}`
    return result
  }

  private get selectedSectionId() {
    const result = this.selectedSection?.id
    return result
  }

  private set selectedSectionId(id: string) {
    if (this.report && this.report.sections && id) {
      const section = this.report.sections.find((_ : { id: string })  => _.id === id)
      this.selectedSection = section
    }
  }

  private mounted() {
    // debugger
    // const tableRef = this.$refs[this.treeTableReference] 
    // const tableElement = tableRef.el
    // const tableDOMRect = table.getBoundingClientRect() as DOMRect
    // const tableX = tableDOMRect.x

  }
  private created() {
    if (this.report && this.report.sections) {
      this.selectedSection = this.report.sections[0]
    }
  }
}
</script>

<style>
.report-pane__v-btn--active {
  background-color: #16a5c6 !important;
  color: #ffffff !important;
  opacity: 1 !important;
  border-radius: 5px 5px 0 0 !important;
}
.report-pane__v-btn--inactive {
  border-radius: 5px 5px 0 0 !important;
}
div.report-pane__container--layout div.v-btn-toggle button.v-btn {
  background-color: rgba(22, 165, 198, 0.33);
  /* background-color: rgba(0,0,0,0.04); */
}
div.report-pane__container--layout div.v-btn-toggle button.v-btn:hover {
  background-color: rgba(22, 165, 198, 0.4);
}
.report-pane__container--layout {
  padding-top: 18px;
  overflow: hidden;
}
.report-pane__span--additional-info {
  font-size: 13px;
  margin-top: 8px;
  color: rgb(136, 136, 136) !important;
}
.report-pane__header--title {
  font-size: larger;
  font-weight: 500;
  line-height: 40px;
  margin-bottom: 20px;
}
.report-pane__span--menu {
  margin-right: 20px;
}
</style>
