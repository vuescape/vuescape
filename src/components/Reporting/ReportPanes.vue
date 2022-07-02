<template>
  <SlidingPanes
    v-loading="isLoading"
    class="reportPanes__sliding-pane--scroll"
    :key="reportNamespace"
    :eventNamespace="reportNamespace"
    :ref="reportNamespace"
    :slidingPaneConfig="reportPaneConfig"
    :slidingPaneActions="slidingPaneActions"
    :shouldHandleResizeEvent="false"
  >
    <report-pane v-if="navigationReport" :style="divStyle" :reportNamespace="navigationNamespace" />
    <div v-else></div>
    <report-pane v-if="mainReport" :style="divStyle" :reportNamespace="mainNamespace" />
    <div v-else></div>
    <report-pane v-if="detailReport" :style="divStyle" :reportNamespace="detailNamespace" />
  </SlidingPanes>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { namespace } from 'vuex-class'

import { getModuleStateByKey, makeStateKey } from '@vuescape/store/storeHelpers'

import { SlidingPaneAction, SlidingPaneConfig, SlidingPaneEvent } from '@vuescape/components/SlidingPanes'
import { ComponentBase } from '@vuescape/index'

import { makeReportPaneNamespace, makeReportPaneNamespacePrefix, PaneKind } from '.'

const ReportPane = () =>
  import(/* webpackChunkName: 'report-pane' */ '@vuescape/components/Reporting/ReportPane.vue').then(m => m.default)

const SlidingPanes = () =>
  import(/* webpackChunkName: 'sliding-panes' */ '@vuescape/components/SlidingPanes').then(m => m.default)

@Component({
  components: { ReportPane, SlidingPanes },
})
export default class ReportPanes extends ComponentBase {
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

  private get navigationNamespace() {
    const result = makeReportPaneNamespace(this.reportId, PaneKind.Navigation)
    return result
  }

  private get mainNamespace() {
    const result = makeReportPaneNamespace(this.reportId, PaneKind.Main)
    return result
  }

  private get detailNamespace() {
    const result = makeReportPaneNamespace(this.reportId, PaneKind.Detail)
    return result
  }

  private get reportNamespace() {
    return makeReportPaneNamespacePrefix(this.reportId)
  }

  @namespace('window/availableHeight').State(state => state.value)
  private availableHeight: Array<number>

  // TODO: Define all the sliding pane actions.
  // Also this should be passed into this component as prop
  // but needs some work (e.g. create a factory) because
  // this component has the context required to perform these
  // actions.  e.g. this.$refs to act on the paneCollection.
  private slidingPaneActions: Array<SlidingPaneAction> = [
    {
      trigger: {
        // Hard coding detail pane as pop out pane.
        // TODO: make this configurable
        namespace: `${this.reportNamespace}/navigation`,
        getter: (state: any) => state.value,
      },
      action: this.handleSlidingPaneAction,
      // putting pane index in context
      context: 0,
    },
    {
      trigger: {
        // Hard coding detail pane as pop out pane.
        // TODO: make this configurable
        namespace: `${this.reportNamespace}/main`,
        getter: (state: any) => state.value,
      },
      action: this.handleSlidingPaneAction,
      context: 1,
    },
    {
      trigger: {
        // Hard coding detail pane as pop out pane.
        // TODO: make this configurable
        namespace: `${this.reportNamespace}/detail`,
        getter: (state: any) => state.value,
      },
      action: this.handleSlidingPaneAction,
      context: 2,
    },
  ]

  private get isLoading() {
    const mainState = getModuleStateByKey(this.mainNamespace, this.$store)
    const navigationState = getModuleStateByKey(this.navigationNamespace, this.$store)
    const detailState = getModuleStateByKey(this.detailNamespace, this.$store)

    const result = mainState?.isPending || navigationState?.isPending || detailState?.isPending
    return result
  }

  private get mainReport() {
    const state = getModuleStateByKey(this.mainNamespace, this.$store)
    const result = state?.value
    return result
  }

  private get navigationReport() {
    const state = getModuleStateByKey(this.navigationNamespace, this.$store)
    const result = state?.value
    return result
  }

  private get detailReport() {
    const state = getModuleStateByKey(this.detailNamespace, this.$store)
    const result = state?.value
    return result
  }

  private handleSlidingPaneAction(value: any, oldValue: any, panes: any, properties?: any) {
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
        .map((i: any) => i.index)[0]

      if (!paneCollection.isPaneOpen(indexToOpen) && (properties && properties === indexToOpen)) {
        // TODO: handle all panes or at minimum left, center and right
        paneCollection.setWidths(...paneCollection.slidingPaneConfig.map((_: any) => _.postActionWidth))
      }
    }
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
    const style = 'height: ' + this.availableHeight[0] + 'px'
    return style
  }

  // TODO: reset state as appropriate
  private async onPaneClosed(index: number) {
    console.info(index)
  }
}
</script>

<style>
.reportPanes__sliding-pane--scroll {
  overflow: hidden;
}
</style>
