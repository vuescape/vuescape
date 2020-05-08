<script lang="ts">
import Vue, { CreateElement } from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Action, namespace, State } from 'vuex-class'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'
import { StoreOperation } from '@vuescape/store/modules'

import Splitpanes from 'splitpanes'

import 'splitpanes/dist/splitpanes.css'

import { SlidingPaneAction } from './SlidingPaneAction'
import { SlidingPaneConfig } from './SlidingPaneConfig'

import { EventType } from './EventType'

import CloseIcon from 'mdi-vue/Close.vue'
import FullscreenIcon from 'mdi-vue/Fullscreen.vue'
import FullscreenExitIcon from 'mdi-vue/FullscreenExit.vue'

@Component({
  components: { CloseIcon, FullscreenIcon, FullscreenExitIcon, Splitpanes },
})
export default class SlidingPanes extends ComponentBase {
  // Amount to adjust height (e.g. accounting for header & footer)
  // Is there a better way?  Could have array of ids and use document.getElementById to get height
  // to dynamically calc and take off of window height. Forces external elements to have unique IDs
  @Prop({ type: Number, default: 0 })
  public windowHeightAdjustmentPx: number

  // Configuration
  @Prop({ type: Array, required: true })
  public slidingPaneConfig: Array<SlidingPaneConfig>

  // Actions triggered by Vuex state state change
  @Prop({ type: Array, required: true })
  public slidingPaneActions: Array<SlidingPaneAction>

  // CSS class to apply to underlying splitpanes default is 'default-theme'
  @Prop({ type: String, default: 'default-theme' })
  public slidingPaneCssClass: string

  // Styles to apply to underlying splitpanes
  @Prop({
    type: Object,
    default: () => {
      return { height: '100%' }
    },
  })
  public slidingPaneStyles: object

  @Prop({ type: Boolean, default: true })
  public areSlotsReactive: boolean

  @Prop({ type: String, required: true })
  public eventNamespace: string

  private panes: Array<{ width: number; savedWidth: number }> = this.slidingPaneConfig.map(p => {
    return {
      width: p.initialWidth !== undefined ? p.initialWidth : 0,
      savedWidth: p.initialWidth !== undefined ? p.initialWidth : 0,
    }
  })

  private resizeTimer: any

  // Saved vuex watchers so we can destroy watchers when component is destroyed
  private vuexWatchers = new Array<() => void>()

  @(namespace('window/availableHeight').Mutation(StoreOperation.Mutation.SET_VALUE))
  private setAvailableHeight: (availableHeight: Array<number>) => void

  @(namespace('window/availableHeight').State(state => state.value))
  private availableHeight: Array<number>

  //#region Public API

  public isPaneOpen(index: number) {
    return this.panes[index].width > 0
  }

  public setWidth(index: number, width: number, savedWidth: number = -1) {
    this.panes[index].savedWidth = savedWidth === -1 ? this.panes[index].width : savedWidth
    this.panes[index].width = width
  }

  public setWidths(...widths: Array<number>) {
    console.info(...widths)
    if (widths) {
      widths.forEach((width, index) => {
        this.setWidth(index, width)
      })
      this.onTransitionEndSetAvailableHeight()
    }
  }

  public hidePane(index: number) {
    this.setWidth(index, 0)
  }

  public maximizeOrRestorePane(index: number) {
    this.doMaximizeOrRestorePane(index)
    this.$store.commit(`${this.eventNamespace}/slidingPaneEvent/SET_VALUE`, {
      eventType: EventType.PaneMaximized,
      payload: index,
    })
    this.onTransitionEndSetAvailableHeight()
  }

  public closePane(index: number) {
    if (this.panes[index].width === 100) {
      this.doMaximizeOrRestorePane(index)
      this.closePane(index)
    } else {
      this.setWidth(index, 0, 0)

      const totalRemainingWidth = this.panes
        .filter(p => p.width !== 0)
        .reduce((totalWidth, pane) => {
          return totalWidth + pane.width
        }, 0)

      for (let i = 0; i < this.panes.length; i++) {
        if (i !== index) {
          const width = (this.panes[i].width * 100) / totalRemainingWidth
          this.setWidth(i, width, width)
        }
      }

      this.$store.commit(`${this.eventNamespace}/slidingPaneEvent/${StoreOperation.Mutation.SET_VALUE}`, {
        eventType: EventType.PaneClosed,
        payload: index,
      })

      this.onTransitionEndSetAvailableHeight()
    }
  }

  //#endregion

  //#region render functions
  public render(h: CreateElement) {
    const rootNode = h('div', [this.createSplitPanes(h)])

    // After creating root node hide unnecessary splitters
    this.setSplitterDisplays()
    return rootNode
  }

  private setSplitterDisplays() {
    // Find visible splitter groups. Some splitters need to be hidden if the
    // pane width is 0.
    // This is an array of arrays containing the start and end pane index
    // of the visible group.
    // e.g. 3 panes with two splitters one between the first and second pane
    //      and one between the second and third pane: [ [0,1], [1-2] ]
    // e.g. 3 panes with one splitter one between the first and third pane:
    //      [ [0,2] ]
    const visibleSplitterGroups = this.panes
      .map((pane, itemIndex) => {
        return {
          itemIndex,
          pane,
        }
      })
      .reduce((result, value, index, array) => {
        const arr = array
          .filter(v => v.pane.width !== 0)
          .slice(index, index + 2)
          .map(p => p.itemIndex)
        result.push(arr)
        return result
      }, [] as Array<Array<number>>)
      .filter(v => v.length === 2)

    // Hide all splitters
    const splitters = document.getElementsByClassName('splitpanes__splitter')
    const splitterArray = [] as Array<Element>
    for (const splitter of splitters) {
      const split = splitter as any
      split.style.display = 'none'
      splitterArray.push(splitter)
    }

    // Make all visible splitters visible
    visibleSplitterGroups.forEach((s, index) => {
      const splitterIndex = visibleSplitterGroups[index][0]
      const splitter = splitterArray[splitterIndex] as any
      splitter.style.display = 'block'
    })
  }

  private createSplitPanes(h: CreateElement) {
    const self = this
    const splitpanes = h(
      'splitpanes',
      {
        class: self.slidingPaneCssClass,
        style: self.slidingPaneStyles,
        attrs: {
          'watch-slots': self.areSlotsReactive,
          'dbl-click-splitter': false,
          'circularReferencePropertyExclusions': ['_routerRoot'],
          // 'push-other-panes': false
        },
        on: {
          resize: (event: any) => {
            self.onResize(event)
          },
          resized: (event: any) => {
            self.onResized(event)
          },
          'pane-maximize': (event: any) => {
            self.onPaneMaximized(event)
          },
          'pane-click': (event: any) => {
            self.onPaneClick(event)
          },
        },
      },
      // Wrap all provided slots (components to display in the pane will be in the slots)
      (this.$slots.default || new Array())
        .filter(slot => slot.width !== 0)
        .map((slot: any, index: number) => this.wrapSlot(h, slot, index)),
    )

    // Wrap the splitpanes and set the div to the correct height to allow 100% to fill parent div
    const wrapperDiv = h('div', { style: { height: '100%' } }, [splitpanes])
    return wrapperDiv
  }

  private wrapSlot(h: CreateElement, slot: any, index: number) {
    const slidingPane = this.slidingPaneConfig[index]
    // Add maximize/restore and close buttons
    if (slidingPane.shouldShowMaximize || slidingPane.shouldShowClose) {
      const header = h(
        'div',
        {
          style: {
            'z-index': 1000,
            // position: 'absolute',
            'text-align': 'right',
            top: 0,
            right: '20px',
            'min-height': '30px',
          },
        },
        this.createHeaderButtons(h, index),
      )
      const wrappedSlot = this.wrapPane(h, index, [header, slot])
      return wrappedSlot
    }

    return this.wrapPane(h, index, [slot])
  }

  private wrapPane(h: CreateElement, index: number, nodes: Array<any>) {
    const classes = []
    if (this.panes.filter(item => item.width !== 0).length === 1 && this.panes[index].width !== 0) {
      if (this.slidingPaneConfig[index].singlePaneCssClass) {
        classes.push(this.slidingPaneConfig[index].singlePaneCssClass)
      }
    } else {
      if (this.slidingPaneConfig[index].multiplePaneCssClass) {
        classes.push(this.slidingPaneConfig[index].multiplePaneCssClass)
      }
    }

    const wrappedSlot = h(
      'div',
      {
        ref: 'wrappedPane_' + index,
        class: classes,
        attrs: {
          'splitpanes-size': this.panes[index].width,
          'splitpanes-min': this.slidingPaneConfig[index].minWidth,
          'splitpanes-max': this.slidingPaneConfig[index].maxWidth,
        },
      },
      nodes,
    )
    return wrappedSlot
  }

  private createHeaderButtons(h: CreateElement, index: number) {
    const links = []
    if (this.slidingPaneConfig[index].shouldShowMaximize) {
      const maximizeRestoreIcon = h(this.panes[index].width === 100 ? 'fullscreen-exit-icon' : 'fullscreen-icon')
      const iconWrapper = h('span', { class: ['sliding-panes__material-icons--large'] }, [maximizeRestoreIcon])

      links.push(
        h(
          'a',
          {
            on: {
              click: () => {
                this.maximizeOrRestorePane(index)
              },
            },
          },
          [iconWrapper],
        ),
      )
    }

    if (this.slidingPaneConfig[index].shouldShowClose) {
      const icon = h('close-icon')
      const iconWrapper = h('span', { class: ['sliding-panes__material-icons--large'] }, [icon])
      links.push(
        h(
          'a',
          {
            on: {
              click: () => {
                this.closePane(index)
              },
            },
          },
          [iconWrapper],
        ),
      )
    }

    return links
  }

  //#endregion

  private onTransitionEndSetAvailableHeight() {
    // SlidingPanes uses a transition to close the window so we need to wait for the transition to end before
    // re-rendering any components dependant on the height.
    const el = this.$el
    const self = this
    // tslint:disable-next-line: only-arrow-functions
    const onTransitionEnd = function() {
      self.setAvailableHeight([self.availableHeight[0]])
      // We only want to listen now...don't want to respond to all transitionend events
      el.removeEventListener('transitionend', onTransitionEnd)
    }
    el.addEventListener('transitionend', onTransitionEnd)
  }

  private doMaximizeOrRestorePane(index: number) {
    const isMaximized = this.panes[index].width === 100
    if (isMaximized) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.panes.length; i++) {
        if (this.panes[i].width !== this.panes[i].savedWidth) {
          this.setWidth(i, this.panes[i].savedWidth)
        }
      }
    } else {
      for (let i = 0; i < this.panes.length; i++) {
        // Not sure this is 100% accurate since with multiple panes might not want to hide all?
        this.setWidth(i, i === index ? 100 : 0)
      }
    }
  }

  private async created() {
    const self = this
    // Set up all the Vuex watchers. Save for later so we can destroy
    if (self.slidingPaneActions) {
      self.slidingPaneActions.forEach((paneAction, index: number) => {
        const paneIndex = index
        if (paneAction) {
          this.vuexWatchers.push(
            self.$store.watch(
              (state: any) => {
                if (state && state[paneAction.trigger.namespace]) {
                  return paneAction.trigger.getter(state[paneAction.trigger.namespace])
                }
                return null
              },
              (value: any, oldValue: any) => {
                if (value && oldValue !== value) {
                  paneAction.action(value, oldValue, self.panes, paneAction.context)
                }
              },
            ),
          )
        }
      })
    }

    this.registerStoreModuleWithInitialValue(`${this.eventNamespace}/slidingPaneEvent`, {
      eventType: EventType.None,
      payload: {},
    })
  }

  private destroyed() {
    this.vuexWatchers.forEach(watcher => watcher())
  }

  private async onResize(event: Array<{ width: number }>) {
    const self = this
    if (!self.resizeTimer) {
      this.resizeTimer = setTimeout(() => {
        self.setAvailableHeight([self.availableHeight[0]])

        self.resizeTimer = undefined
      }, 50)
    }
  }

  private async onResized(event: Array<{ width: number }>) {
    // If we resize to a maximize scenario then use maximize logic
    const maximizeIndex = event.findIndex(item => item.width === 100)
    if (maximizeIndex >= 0) {
      this.maximizeOrRestorePane(maximizeIndex)
      return
    }

    for (let i = 0; i < this.panes.length; i++) {
      this.setWidth(i, event[i].width, this.panes[i].savedWidth)
    }

    this.$store.commit(`${this.eventNamespace}/slidingPaneEvent/SET_VALUE`, {
      eventType: EventType.PaneResized,
      payload: event,
    })

    this.setAvailableHeight([this.availableHeight[0]])
  }

  private async onPaneClick(event: any) {
    console.log('SPLITPANE onPaneClicked fired', event)
  }

  private async onPaneMaximized(event: any) {
    console.log('SPLITPANE onPaneMaximized fired', event)
    this.maximizeOrRestorePane(event.index)
  }
}
</script>
<style>
.splitpanes__pane {
  /* setting height to 100% so since resize should happen outside of pane no need to scroll */
  overflow-y: hidden !important;
  overflow-x: auto !important;
}
.splitpanes.default-theme .splitpanes__pane {
  background-color: white;
}
.splitpanes--vertical > .splitpanes__splitter {
  background-color: #dddddd !important;
}
.sliding-panes__material-icons--large {
  margin-top: 6px;
  margin-right: 6px;
  font-size: 24px;
  color: #555555;
}
</style>
