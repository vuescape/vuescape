<template>
  <SlidingPanes
    :key="reportNamespace"
    :eventNamespace="reportNamespace"
    :ref="reportNamespace"
    v-if="shouldRender"
    class="reportPanes__sliding-pane--scroll"
    :slidingPaneConfig="reportPaneConfig"
    :slidingPaneActions="reportPaneActions"
  >
    <div>Pane 1</div>
    <div>Pane 2</div>
    <div>Pane 3</div>
  </SlidingPanes>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Action, namespace, State } from 'vuex-class'

import { ApiBaseUrlKey, mapApiBaseUrlKeyToUrl } from '@config/index'

import { EventType, SlidingPaneAction, SlidingPaneConfig, SlidingPaneEvent } from '@vuescape/components/SlidingPanes'
import { ComponentBase, HttpMethod, makePropertyComparer, SortComparisonStrategy, TreeTableRow } from '@vuescape/index'
import { ModuleState, ns, StoreOperation } from '@vuescape/store/modules/types'

import { ReportPaneConfig } from './ReportPaneConfig'

const SlidingPanes = () =>
  import(/* webpackChunkName: 'sliding-panes' */ '@vuescape/components/SlidingPanes').then(m => m.default)

import route from './route'

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
  components: { SlidingPanes },
})
export default class ReportPanes extends ComponentBase {
  private routeName = '' // route.name
  private shouldRender = false
  private isDestroyed = false
  // Props passed in on route
  @Prop({ type: String, required: true })
  private reportId: string

  // TODO: Need to be able to access dynamic namesapce -- not possible accessing vue instance with decorator
  @(namespace('reportPanes/slidingPaneEvent').State(state => state.value))
  private slidingPaneEvent: SlidingPaneEvent

  @(namespace('window/availableHeight').State(state => state.value))
  private availableHeight: Array<number>

  // TODO: Define all the sliding pane actions.
  private slidingPaneActions: Array<SlidingPaneAction> = [
    {
      trigger: {
        namespace: 'reportPane/selectedRow', // TODO: import constant from someplace
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

  private emptyRow: TreeTableRow = {
    id: '',
    isExpandable: false,
    isExpanded: false,
    isVisible: true,
    isSelected: false,
    depth: 0,
    cssClasses: '',
    cells: [],
  }

  private get reportNamespace() {
    return this.reportId ? 'reportPanes-' + this.reportId : ''
  }

  private get reportContext() {
    return this.$route.params ? this.$route.params.reportContext : undefined
  }

  private get reportPaneConfig() {
    return this.$route.params ? this.$route.params.reportPaneConfig : undefined
  }

  private get reportPaneActions() {
    return this.$route.params ? this.$route.params.reportPaneActions : undefined
  }

  @Watch('slidingPaneEvent')
  private onSlidingPaneEvent(to: SlidingPaneEvent, from: SlidingPaneEvent) {
    if (!to || to.eventType === EventType.None) {
      return
    }
    if (to.eventType === EventType.PaneClosed) {
      this.onPaneClosed(to.payload as number)
    } else if (to.eventType === EventType.PaneResized) {
      console.log('resize event')
    } else if (to.eventType === EventType.PaneMaximized) {
      console.log('maximize event')
    }
  }

  // TODO: implement this as needed
  @Watch('$route')
  private async onRouteChanged(to: Route, from: Route) {
  }

  // TODO: reset state as appropriate
  private async onPaneClosed(index: number) {
  }

  private beforeDestroy() {
    this.isDestroyed = true
  }

  private async mounted() {
    this.shouldRender = true
  }

  private async created() {
    // Register applicable store modules
    this.registerStoreModuleWithInitialValue<string>('reportPanes/value', '')

    // check Links in this.reportPaneConfig and register/invoke any URLs
    // and display the results in the correct pane
    // Pane will render the result from the server side as a treetable/report
}
</script>

<style>
.reportPanes__sliding-pane--scroll {
  overflow: hidden;
}
</style>
