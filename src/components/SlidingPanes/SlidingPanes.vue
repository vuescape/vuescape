<script lang="ts">
import Vue, { CreateElement } from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

import Splitpanes from 'splitpanes'

import 'splitpanes/dist/splitpanes.css'

import { SlidingPaneAction } from './SlidingPaneAction'
import { SlidingPaneConfig } from './SlidingPaneConfig'

@Component({
  components: { Splitpanes },
})
export default class SlidingPanes extends Vue {
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

  private panes: Array<{ width: number; savedWidth: number }> = this.slidingPaneConfig.map(p => {
    return {
      width: p.initialWidth !== undefined ? p.initialWidth : 0,
      savedWidth: p.initialWidth !== undefined ? p.initialWidth : 0,
    }
  })

  // Height of panes.  Gets set dynamically on resize.
  private height = 100

  // Saved vuex watchers so we can destroy watchers when component is destroyed
  private vuexWatchers = new Array<() => void>()

  //#region Public API

  public isPaneOpen(index: number) {
    return this.panes[index].width > 0
  }

  public setWidth(index: number, width: number, savedWidth: number = -1) {
    this.panes[index].savedWidth = savedWidth === -1 ? this.panes[index].width : savedWidth
    this.panes[index].width = width
  }

  public setWidths(...widths: Array<number>) {
    if (widths) {
      widths.forEach((width, index) => {
        this.setWidth(index, width)
      })
    }
  }

  public hidePane(index: number) {
    this.setWidth(index, 0)
  }

  public maximizeOrRestorePane(index: number) {
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

  public closePane(index: number) {
    if (this.panes[index].width === 100) {
      this.maximizeOrRestorePane(index)
      this.closePane(index)
      return
    }

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

    console.log('SPLITPANE close index ' + index)
  }

  //#endregion

  //#region render functions
  public render(h: CreateElement) {
    console.log('render called')
    const rootNode = h('div', [this.createResizeObserver(h), this.createSplitPanes(h)])

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
      .reduce(
        (result, value, index, array) => {
          const arr = array
            .filter(v => v.pane.width !== 0)
            .slice(index, index + 2)
            .map(p => p.itemIndex)
          result.push(arr)
          return result
        },
        [] as Array<Array<number>>,
      )
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

  // Watch for resize events so we can adjust the height of the panes
  private createResizeObserver(h: CreateElement) {
    const self = this
    return h('resize-observer', {
      on: {
        notify(event: any) {
          self.handleResize()
        },
      },
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
          // 'push-other-panes': false
        },
        on: {
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
    const wrapperDiv = h('div', { style: { height: `${this.height}px` } }, [splitpanes])
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
      const maximizeRestoreIconName: string = this.panes[index].width === 100 ? 'fullscreen_exit' : 'fullscreen'
      const maximizeRestoreIcon = h('i', { class: ['material-icons'] }, maximizeRestoreIconName)
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
          [maximizeRestoreIcon],
        ),
      )
    }

    if (this.slidingPaneConfig[index].shouldShowClose) {
      const icon = h('i', { class: ['material-icons'] }, 'close')
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
          [icon],
        ),
      )
    }

    return links
  }

//#endregion 

  private getMainHeight() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    const mainHeight = windowHeight - this.windowHeightAdjustmentPx
    console.log('mainheight = ' + mainHeight)
    return mainHeight
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
  }

  private destroyed() {
    this.vuexWatchers.forEach(watcher => watcher())
  }

  private async mounted() {
    this.height = this.getMainHeight()
    await this.handleResize()
  }

  private async handleResize() {
    const newheight = this.getMainHeight()
    if (newheight !== this.height) {
      this.height = newheight
    }
  }

  private async onResized(event: any) {
    const isOnlyOnePaneVisible = this.panes.filter(item => item.width !== 0).length === 1

    for (let i = 0; i < this.panes.length; i++) {
      // If we are going max or min then don't save this as we will want to
      // restore to the previous value and not the min max setting
      if (event[i].width !== 0 && event[i].width !== 100) {
        this.setWidth(i, event[i].width)
      } else {
        this.setWidth(i, event[i].width, this.panes[i].savedWidth)
      }
    }

    console.log('SPLITPANE onResized fired', event)
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
  overflow-y: auto !important;
  overflow-x: auto !important;
}
.splitpanes__splitter {
  /* cursor seems to render properly sometimes so set here to try to help */
  cursor: col-resize !important;
  background-color: #fafafa !important;
}
</style>
