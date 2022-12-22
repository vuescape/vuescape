<template>
  <div
    :key="reportNamespaceValue"
    class="report-pane__container--layout"
  >
    <div :ref="reportHeaderRef">
      <v-layout
        align-start
        fill-height
        justify-start
        row
        report-pane__v-layout--margin
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
        class="report-pane__section--layout"
        :style="subheaderStyle"
        :ref="tabHeaderRow"
      >
        <v-flex xs11>
          <v-btn-toggle
            v-if="areMultipleReportSections"
            style="text-align: left !important; box-shadow: unset"
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
              @click="changeSection"
            >{{ section.name }}
            </v-btn
            >
          </v-btn-toggle>
        </v-flex>
        <v-spacer></v-spacer>
        <span class="report-pane__span--additional-info">{{ report.additionalReportInfo }}</span>
        <span class="exclude-from-pdf report-pane__span--menu">
          <download-menu
            v-if="shouldDisplayDownloadMenu"
            :shouldDisplayPdf="false"
            :shouldDisplayCsv="false"
            :shouldDisplayChart="false"
            :shouldDisplayExcel="shouldDisplayExcelDownload"
            :clickHandlers="{ clickExcel: downloadExcel }"
          ></download-menu>
        </span>
      </v-layout>
    </div>
    <tree-table
      v-loading="isPerformingLongRunningOperation"
      v-show="selectedSection.id"
      :id="selectedSection.treeTable.id"
      :ref="treeTableReference"
      :key="selectedSection.id"
      :headers="selectedSection.treeTable.content.headers"
      :footers="selectedSection.treeTable.content.footers"
      :rows="selectedSection.treeTable.content.rows"
      :columnDefinitions="selectedSection.treeTable.columnDefinitions"
      :shouldIncludeFooter="selectedSection.treeTable.content.shouldIncludeFooter"
      :sortLevel="selectedSection.treeTable.content.sortLevel"
      :cssStyles="cssStyles"
      :cssClass="selectedSection.treeTable.content.cssClass"
      @columns-resized="rightAlignHeader"
    ></tree-table>
    <v-alert
      v-if="areNoResults"
      class="report-pane__v-alert--layout"
      :value="areNoResults"
      transition="fade-transition"
      type="info"
      outline
    >
      No results found.
    </v-alert>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { dispatchAndAwaitAction, getModuleStateByKey, registerStoreModule } from '@vuescape/store/storeHelpers'

import {
  ComponentBase, decodeBase64String, Dictionary, downloadFile, HttpMethod, Section, toEnum,
} from '@vuescape/index'
import { Link, PayloadEncodingKind, ResourceKind } from '@vuescape/reporting-domain'

const DownloadMenu = () => import(/* webpackChunkName: 'download-button' */ '@vuescape/components/DownloadMenu').then(m => m.default)
const TreeTable    = () => import(/* webpackChunkName: 'tree-table' */ '@vuescape/components/TreeTable-v2/').then(m => m.default)

@Component({
  components: {
    DownloadMenu,
    TreeTable,
  },
})
export default class ReportPane extends ComponentBase {
  private isPerformingLongRunningOperation                                            = false
  private reportNamespaceValue                                                        = ''
  private scrollPositionsValue: Dictionary<{ scrollLeft: number; scrollTop: number }> = {}

  private selectedSection: any = { id: '' }
  private treeTableHeight      = 0

  // Props passed in on route
  @Prop({ type: String, required: true })
  private reportNamespace: string

  @Prop({ type: String, default: '' })
  private divStyle: string

  @namespace('window/availableHeight').State(state => state.value)
  private availableHeight: Array<number>

  private get subheaderStyle() {
    if (this.areMultipleReportSections) {
      return {}
    }

    return { marginTop: '-30px' }
  }

  private get areMultipleReportSections() {
    const result = this.report?.sections?.length > 1
    return result
  }

  private get shouldDisplayDownloadMenu() {
    const result = this.report && this.report.downloadLinks && this.report.downloadLinks.length > 0
    return result
  }

  private get tabHeaderRow() {
    return this.reportHeaderRef + '-tabHeaderRow'
  }

  private get reportHeaderRef() {
    return 'reportPaneHeader-' + this.reportNamespaceValue
  }

  private get cssStyles() {
    const existingStyles  = this.selectedSection.treeTable.content.cssStyles ?? {}
    existingStyles.height = this.treeTableHeight + 'px'
    return existingStyles
  }

  private get shouldDisplayExcelDownload() {
    const result = this.shouldDisplayDownloadMenu && this.report.downloadLinks.some((_: Link) => _.resourceKind === ResourceKind.Excel)
    return result
  }

  private get report() {
    const state  = getModuleStateByKey(this.reportNamespaceValue, this.$store)
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
    const result = `${this.reportNamespaceValue}-${this.selectedSection.id}`
    return result
  }

  private get areNoResults() {
    const result = this.report && this.selectedSection?.treeTable?.content?.rows && this.selectedSection?.treeTable?.content?.rows.length !== 0

    return !result
  }

  private get treeTableTbody() {
    const treeTableReference = this.treeTableReference
    const treeTable          = this.$refs[treeTableReference] as { $el: Element }
    if (!treeTable) {
      return
    }

    const table = treeTable.$el
    const tbody = table.querySelector('tbody')
    return tbody
  }

  private get selectedSectionId() {
    const result = this.selectedSection?.id!
    return result
  }

  private set selectedSectionId(id: string) {
    const self = this
    setTimeout(() => {
      if (self.report && self.report.sections && id) {
        const section                                      = self.report.sections.find((_: { id: string }) => _.id === id)
        self.scrollPositionsValue[self.selectedSection.id] = self.calculateScrollBarPositions()!
        self.selectedSection                               = section
        setTimeout(() => {
          self.positionScrollBars()
        }, 1)
        self.isPerformingLongRunningOperation = false
      }
    }, 300)
  }

  private changeSection() {
    const self                            = this
    self.isPerformingLongRunningOperation = true
    // setTimeout(() => self.isPerformingLongRunningOperation = true, 1)
  }

  @Watch('reportNamespace')
  private reportNamespaceWatcher(val: string, oldVal: string) {
    this.reportNamespaceValue = val
  }

  @Watch('availableHeight')
  private availableHeightWatcher(val: any, oldVal: any) {
    this.setTreeTableHeight()
  }

  // All resource kinds are supported here.
  private async downloadReport(resourceKind: ResourceKind) {
    this.isPerformingLongRunningOperation = true
    await this.$nextTick()
    const downloadNamespace = this.reportNamespaceValue + '/download'
    const link              = this.report.downloadLinks.find((_: Link) => _.resourceKind === resourceKind) as Link

    const source = link.source
    registerStoreModule(this.$store, downloadNamespace, HttpMethod.Get, source, undefined, false)

    await dispatchAndAwaitAction(downloadNamespace, source, this.$store)

    const state = getModuleStateByKey(downloadNamespace, this.$store)

    // TODO Use file name from the server?
    // available at data.metadata.name
    const now                  = new Date()
    const fileDate             = `_${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(
      -2)}`
    let filename               = ''
    let shouldAddByteOrderMark = false
    if (resourceKind === ResourceKind.Excel) {
      filename = `${this.report.title}${fileDate}.xlsx`
    }
    else if (resourceKind === ResourceKind.Csv) {
      filename               = `${this.report.title}${fileDate}.csv`
      shouldAddByteOrderMark = true
    }

    const data            = state?.value
    const isBase64Encoded = toEnum(PayloadEncodingKind, data.payloadEncodingKind) === PayloadEncodingKind.Base64
    const fileContents    = isBase64Encoded ? decodeBase64String(data.payload) : data.payload

    downloadFile(fileContents, filename, shouldAddByteOrderMark)
    this.isPerformingLongRunningOperation = false
  }

  private downloadExcel() {
    if (!this.shouldDisplayExcelDownload) {
      return
    }

    this.downloadReport(ResourceKind.Excel)
  }

  // Set width to properly right align as of and download button
  private rightAlignHeader() {
    const self = this
    requestAnimationFrame(() => self.rightAlignHeaderImpl())
  }

  private rightAlignHeaderImpl() {
    const treeTableReference = this.treeTableReference
    const treeTable          = this.$refs[treeTableReference] as { $el: Element }
    if (!treeTable) {
      return
    }

    const clientWidth = treeTable.$el.clientWidth
    const row         = treeTable.$el.querySelector('tr')
    if (row) {
      const rowWidth = row.clientWidth
      let width      = rowWidth
      if (clientWidth < rowWidth) {
        width = clientWidth
      }

      const tabHeaderRow = this.$refs[this.tabHeaderRow] as HTMLElement
      if (tabHeaderRow) {
        tabHeaderRow.style.width = width + 'px'
      }
    }
  }

  private setTreeTableHeight() {
    const reportHeaderRef = this.reportHeaderRef
    const reportHeader    = this.$refs[reportHeaderRef] as any

    if (!reportHeader || !this.availableHeight || this.availableHeight.length === 0) {
      return
    }

    const thisElement = this.$el as any
    const paddingTop  = Number.parseFloat(window.getComputedStyle(thisElement.firstChild, null)
      .getPropertyValue('padding-top'))

    const reportHeaderHeight = reportHeader.getBoundingClientRect().height as number
    const treeTableHeight    = this.availableHeight[0] - reportHeaderHeight - paddingTop - 20 // give some additional space
    this.treeTableHeight     = treeTableHeight
  }

  private calculateScrollBarPositions() {
    const tbody = this.treeTableTbody
    if (tbody) {
      const scrollLeft = tbody.scrollLeft
      const scrollTop  = tbody.scrollTop
      return {
        scrollLeft,
        scrollTop,
      }
    }
  }

  private positionScrollBars() {
    const tbody = this.treeTableTbody
    if (tbody) {
      const selectedSectionId = this.selectedSection.id!
      const self              = this
      setTimeout(() => {
        tbody.scrollLeft = self.scrollPositionsValue[selectedSectionId].scrollLeft
        tbody.scrollTop  = self.scrollPositionsValue[selectedSectionId].scrollTop
      }, 1)
    }
  }

  private mounted() {
    this.setTreeTableHeight()
    this.positionScrollBars()
  }

  private created() {
    this.reportNamespaceValue = this.reportNamespace
    if (this.report && this.report.sections) {
      this.report.sections.forEach((_: Section) => {
        this.scrollPositionsValue[_.id!] = {
          scrollLeft: Number.MAX_SAFE_INTEGER,
          scrollTop : 0,
        }
      })
      this.selectedSection = this.report.sections[0]
    }
  }
}
</script>

<style>
.report-pane__v-btn--active {
  background-color: #16a5c6 !important;
  color:            #ffffff !important;
  opacity:          1 !important;
  border-radius:    5px 5px 0 0 !important;
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
  padding-top:  10px;
  overflow:     hidden;
  margin-left:  16px;
  margin-right: 16px;
}
.report-pane__span--additional-info {
  font-size:     13px;
  margin-top:    8px;
  margin-bottom: 8px;
  color:         rgb(136, 136, 136) !important;
}
.report-pane__header--title {
  font-size:     18px;
  font-weight:   500;
  line-height:   40px;
  margin-bottom: 10px;
}
.report-pane__container--layout .info--text.report-pane__v-alert--layout {
  border-color:  #9bdddb !important;
  border-radius: 5px;
  margin-top:    10px;
  margin-bottom: 10px;
  margin-right:  6px;
  text-align:    center;
}
.report-pane__section--layout {
  white-space: nowrap;
  margin-top:  -10px;
}
</style>
