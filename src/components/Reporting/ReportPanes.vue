<template>
  <SlidingPanes
    :key="reportNamespace"
    :eventNamespace="reportNamespace"
    :ref="reportNamespace"
    v-if="shouldRender"
    class="reportPanes__sliding-pane--scroll"
    :slidingPaneConfig="reportPaneConfig"
    :slidingPaneActions="slidingPaneActions"
  >
    <report-pane
      v-if="navigationReport"
      v-loading="navigationReport.isPending"
      :style="divStyle"
      :reportNamespace="reportNamespace + '/navigation'"
    />
    <div v-else></div>
    <report-pane
      v-if="mainReport"
      v-loading="navigationReport.isPending"
      :style="divStyle"
      :reportNamespace="reportNamespace + '/main'"
    />
    <div v-else></div>
  </SlidingPanes>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Action, namespace, State } from 'vuex-class'

import { getModuleStateByKey, makeStateKey } from '@vuescape/store/storeHelpers'

import { EventType, SlidingPaneAction, SlidingPaneConfig, SlidingPaneEvent } from '@vuescape/components/SlidingPanes'
import { ComponentBase, HttpMethod, makePropertyComparer, SortComparisonStrategy, TreeTableRow } from '@vuescape/index'
import { ModuleState, ns, StoreOperation } from '@vuescape/store/modules/types'

const ReportPane = () =>  
  import(/* webpackChunkName: 'report-pane' */ '@vuescape/components/Reporting/ReportPane.vue').then(m => m.default)

const SlidingPanes = () =>  
  import(/* webpackChunkName: 'sliding-panes' */ '@vuescape/components/SlidingPanes').then(m => m.default)

// TODO: add props:  (use as key), pass in reportname/reportid and reportconfig as query (what to do with report config?)
// TODO: accept config for sliding panes -- what panes are being used? What queries to run for each pane?

// [
//   {
//     minWidth: 10,
//     maxWidth: 40,
//     initialWidth: 30,
//     singlePaneCssClass: 'app__sliding-pane--single',
//     multiplePaneCssClass: 'app__sliding-pane--multiple',
//     postActionWidth: 30,
//   },
//   {
//     minWidth: 10,
//     maxWidth: 50,
//     initialWidth: 0,
//     postActionWidth: 70,
//   },
//   {
//     minWidth: 10,
//     maxWidth: 40,
//     initialWidth: 0,
//     singlePaneCssClass: 'app__sliding-pane--single',
//     multiplePaneCssClass: 'app__sliding-pane--multiple',
//     shouldShowMaximize: true,
//     shouldShowClose: true,
//   },
// ]
@Component({
  components: { ReportPane, SlidingPanes },
})
export default class ReportPanes extends ComponentBase {
  private shouldRender = true
  private isDestroyed = false
  // Props passed in on route
  @Prop({ type: String, required: true })
  private reportId: string

  @Prop({ type: Array, required: true })
  private reportPaneConfig: Array<SlidingPaneConfig>

  @Prop({ type: Array, required: false })
  private reportPaneActions: Array<SlidingPaneAction>

  private get slidingPaneEvent() {
    const stateKey = makeStateKey(this.reportNamespace, 'slidingPaneEvent')
    const moduleState = getModuleStateByKey(stateKey, this.$store)
    if (moduleState && moduleState.value) {
      return moduleState.value as SlidingPaneEvent
    }

    return undefined
  }

  @(namespace('window/availableHeight').State(state => state.value))
  private availableHeight: Array<number>

  // TODO: Define all the sliding pane actions.
  private slidingPaneActions: Array<SlidingPaneAction> = [
    {
      trigger: {
        namespace: `${this.reportNamespace}/selectedRow`, // TODO: import constant from someplace
        getter: (state: any) => state.value,
      },
      action: (value, oldValue, panes, properties?: any) => {
        if (!value) {
          return
        }
        const paneCollection = this.$refs[this.reportNamespace] as any
        // if first time...TODO: need different check since id 
        if (value.id !== '') {
          const indexToOpen = paneCollection.slidingPaneConfig
            .map((v: any, index: number) => {
              return { item: v, index }
            })
            .filter((i: any) => i.item.initialWidth === 0)
            .map((i: any) => i.index)
          if (!paneCollection.isPaneOpen(indexToOpen)) {
            // TODO: handle all panes or at minimum left, center and right
            paneCollection.setWidths(
              paneCollection.slidingPaneConfig[0].postActionWidth,
              paneCollection.slidingPaneConfig[1].postActionWidth,
            )
          }
        }
      },
    },
  ]

  private get mainReport() {
    const reportNamespace = this.reportNamespace + '/main'
    const state = getModuleStateByKey(reportNamespace, this.$store)
    const result = state?.value
    return result
  }

  private get navigationReport() {
    const reportNamespace = this.reportNamespace + '/navigation'
    const state = getModuleStateByKey(reportNamespace, this.$store)
    const result = state?.value
    return result
  }

  private get reportNamespace() {
    const result= makeStateKey(this.reportId ?? 'defaultReportId','reportPanes')    
    return result
  }

  // @Watch('slidingPaneEvent')
  // private onSlidingPaneEvent(to: SlidingPaneEvent, from: SlidingPaneEvent) {
  //   if (!to || to.eventType === EventType.None) {
  //     return
  //   }
  //   if (to.eventType === EventType.PaneClosed) {
  //     this.onPaneClosed(to.payload as number)
  //   } else if (to.eventType === EventType.PaneResized) {
  //     console.log('resize event')
  //   } else if (to.eventType === EventType.PaneMaximized) {
  //     console.log('maximize event')
  //   }
  // }

  // TODO: implement this as needed
  @Watch('$route')
  private async onRouteChanged(to: Route, from: Route) {
    console.info('route changed')
  }

  private get divStyle() {
    const style = 'height: ' + (this.availableHeight[0] + 36) + 'px'
    return style 
  }

  // TODO: reset state as appropriate
  private async onPaneClosed(index: number) {
    console.info(index)
  }

  private beforeDestroy() {
    this.isDestroyed = true
  }

  private async created() {
    // Register applicable store modules
    // this.registerStoreModuleWithInitialValue<string>('reportPanes/value', '')
  }
}
</script>

<style>
.reportPanes__sliding-pane--scroll {
  overflow: hidden;
}
</style>
