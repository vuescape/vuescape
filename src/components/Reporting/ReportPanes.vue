<template>
  <SlidingPanes
    v-if="shouldRenderReport"
    class="reportPanes__sliding-pane--scroll"
    eventNamespace="reportPanes"
    ref="reportPanes"
    :slidingPaneConfig="[
      {
        minWidth: 0,
        maxWidth: 100,
        initialWidth: 100,
        singlePaneCssClass: 'app__sliding-pane--single',
        multiplePaneCssClass: 'app__sliding-pane--multiple',
        postActionWidth: 70,
      },
      {
        minWidth: 16,
        maxWidth: 100,
        initialWidth: 0,
        shouldShowMaximize: true,
        shouldShowClose: true,
        postActionWidth: 30,
      },
      {
        minWidth: 0,
        maxWidth: 100,
        initialWidth: 100,
        singlePaneCssClass: 'app__sliding-pane--single',
        multiplePaneCssClass: 'app__sliding-pane--multiple',
        postActionWidth: 70,
      },
    ]"
    :slidingPaneActions="slidingPaneActions"
  >
  <div>Pane 1</div>
  <div>Pane 2</div>
  <div>Pane 3</div>
  </SlidingPanes>
  <!-- <div
    v-else
    v-loading="isPending"
    :style="`height: ${availableHeight}px;`"
  ></div> -->
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Action, namespace, State } from 'vuex-class'

import { ApiBaseUrlKey, mapApiBaseUrlKeyToUrl } from '@config/index'

import { EventType, SlidingPaneAction, SlidingPaneConfig, SlidingPaneEvent } from '@vuescape/components/SlidingPanes'
import { ComponentBase, HttpMethod, makePropertyComparer, SortComparisonStrategy, TreeTableRow } from '@vuescape/index'
import { ModuleState, ns, StoreOperation } from '@vuescape/store/modules/types'

const SlidingPanes = () =>
  import(/* webpackChunkName: 'sliding-panes' */ '@vuescape/components/SlidingPanes').then(m => m.default)

// import route from './route'

@Component({
  components: { SlidingPanes },
})
export default class ReportPanes extends ComponentBase {
  private routeName = '' // route.name
  private shouldRenderBenchmarking = false
  private isDestroyed = false
  // Props passed in on route
  @Prop({ type: String, required: true })
  private portfolioStrategyId: string
  @Prop({ type: String, required: false })
  private entityId: string

  @(namespace('benchmarking/selectedEntity').State((state: any) => state.value))
  private selectedEntity: any
  @(namespace('benchmarking/selectedEntity').Mutation(StoreOperation.Mutation.SET_VALUE))
  private setSelectedEntity: any

  @(namespace('benchmarking/selectedPortfolioStrategyId').State((state: any) => state.value))
  private selectedPortfolioStrategyId: string
  @(namespace('benchmarking/selectedPortfolioStrategyId').Mutation(StoreOperation.Mutation.SET_VALUE))
  private setSelectedPortfolioStrategyId: (portfolioStrategyId: string) => void

  @State('benchmarking/portfolio-strategy')
  private portfolioStrategyModule: ModuleState<any>

  @(namespace('benchmarking/slidingPaneEvent').State(state => state.value))
  private slidingPaneEvent: SlidingPaneEvent

  @Action(ns('benchmarking/portfolio-strategy', 'portfolio-strategy'))
  private getPortfolioStrategy: any

  @(namespace('window/availableHeight').State(state => state.value))
  private availableHeight: Array<number>

  private slidingPaneActions: Array<SlidingPaneAction> = [
    {
      trigger: {
        namespace: 'benchmarking-report/selectedRow', // TODO: import constant from someplace
        getter: (state: any) => state.value,
      },
      action: (value, oldValue, panes, properties?: any) => {
        if (!value) {
          return
        }
        const paneCollection = this.$refs.benchmarkingPanes as any
        if (value.id !== '') {
          const benchMarkingPanes = this.$refs.benchmarkingPanes as any
          const indexToOpen = benchMarkingPanes.slidingPaneConfig
            .map((v: any, index: number) => {
              return { item: v, index }
            })
            .filter((i: any) => i.item.initialWidth === 0)
            .map((i: any) => i.index)
          if (!paneCollection.isPaneOpen(indexToOpen)) {
            paneCollection.setWidths(
              benchMarkingPanes.slidingPaneConfig[0].postActionWidth,
              benchMarkingPanes.slidingPaneConfig[1].postActionWidth,
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

  @(namespace('benchmarking-report/selectedRow').State((state: any) => state.value))
  private selectedRow: TreeTableRow

  @(namespace('benchmarking-report/selectedRow').Mutation(StoreOperation.Mutation.SET_VALUE))
  private setSelectedRow: any

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

  @Watch('$route')
  private async onRouteChanged(to: Route, from: Route) {
    if (
      this.portfolioStrategyModule.hasValue &&
      this.portfolioStrategyModule.value.id !== to.params.portfolioStrategyId
    ) {
      // TODO: This reload the entire app!  Which is not cool.
      // Ideally, would just like a way to re-run the page lifecycle so that all state is cleared and new
      // portfolio data is collected.
      this.$router.go(0)
      return
    }

    if (
      this.portfolioStrategyModule.value &&
      this.portfolioStrategyModule.value.entities &&
      this.portfolioStrategyModule.value.entities.length
    ) {
      const entity = (this.portfolioStrategyModule.value.entities as Array<{ id: string }>).find(
        _ => _.id === to.params.entityId,
      )

      if (entity) {
        this.setSelectedEntityIfDifferent(entity)
      } else {
        const defaultEntity = (this.portfolioStrategyModule.value.entities as Array<{ id: string }>).sort(
          makePropertyComparer('name', SortComparisonStrategy.StringCaseInsensitive),
        )[0]
        this.$router.replace({
          name: this.routeName,
          params: { portfolioStrategyId: this.portfolioStrategyId, entityId: defaultEntity.id },
        })
      }
    }
  }

  @Watch('selectedEntity')
  private onSelectedEntityChanged(to: { id: string }, from: { id: string }) {
    if (from && to && from.id !== to.id) {
      this.$router.replace({
        name: this.routeName,
        params: {
          portfolioStrategyId: this.selectedPortfolioStrategyId,
          entityId: this.selectedEntity && this.selectedEntity.id ? this.selectedEntity.id : undefined,
        },
      })
    }
  }

  private setSelectedEntityIfDifferent(entity: { id: string }) {
    if (this.selectedEntity.id !== entity.id) {
      this.setSelectedEntity(entity)
    }
  }

  private async onPaneClosed(index: number) {
    // This is modifying the row directly but works because we have a reference and are not currently keeping the Array<TreeTableRow> in vuex
    // Should the rows be in vuex?  Then every expand/collapse/selected mutation etc. should be handled via vuex
    // const benchmarkingReportComponent = this.$refs.benchmarkingReportComponent as any

    // benchmarkingReportComponent.setRowProperty(this.selectedRow, false, (r: any, val: any) => {
    //   r.isSelected = val
    // })

    this.setSelectedRow(this.emptyRow)
  }

  private beforeDestroy() {
    this.isDestroyed = true
  }

  private async mounted() {
    await this.getPortfolioStrategy({
      portfolioStrategyId: this.portfolioStrategyId,
      reportType: 'Benchmarking',
    })

    // Get the entity for the entityId
    if (this.portfolioStrategyModule.value) {
      const entity = (this.portfolioStrategyModule.value.entities as Array<{ id: string }>).find(
        _ => _.id === this.entityId,
      )
      let entityId
      if (entity) {
        this.setSelectedEntityIfDifferent(entity)
        entityId = this.selectedEntity.id
      }
      if (!this.isDestroyed) {
        this.$router.replace({
          name: this.routeName,
          params: {
            portfolioStrategyId: this.selectedPortfolioStrategyId,
            entityId,
          },
        })
      }
    }

    this.shouldRenderBenchmarking = true
  }

  private async created() {
    this.registerStoreModuleWithInitialValue<any>('benchmarking/selectedPortfolioStrategyId', this.portfolioStrategyId)

    this.registerStoreModule<any>(
      'benchmarking/portfolio-strategy',
      HttpMethod.Get,
      'portfolio-strategy',
      mapApiBaseUrlKeyToUrl(ApiBaseUrlKey.Web),
    )

    this.registerStoreModuleWithInitialValue<any>('benchmarking/selectedEntity', {
      id: '',
      name: '',
      fiscalYearEndDate: null,
    })
  }
}
</script>

<style>
.benchmarking__sliding-pane--scroll {
  overflow: hidden;
}
/* Override scrolling since we will handle scrolling ourselves either through a component or fitting/scaling to the correct height. */
main div.app__container--scroll {
  /* overflow-y: hidden; */
}
</style>
