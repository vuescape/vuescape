<template>
  <div>
    <div
      :ref="sliderId"
      :id="sliderId"
    >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Action, State } from 'vuex-class'

import { Component, Prop, Watch } from 'vue-property-decorator'

import * as noUiSlider from 'nouislider'
import 'nouislider/distribute/nouislider.css'

@Component
export default class DateRangeSlider extends Vue {
  @Prop({ type: String })
  private id: string

  @Prop({ type: String, default: 'tap-drag' })
  private behavior: string

  @Prop({ type: Array, required: true })
  private startingHandlePositions: Array<number>

  @Prop({ type: Number, default: 1 })
  private minHandleSeparation: number

  @Prop({ type: Number, default: 1 })
  private maxHandleSeparation: number

  @Prop({ type: Number, default: 16 })
  private numberOfRanges: number

  @Prop({ type: Number, default: 0 })
  private startingRangeValue: number

  @Prop({ type: Function })
  private rangeAxisFormatter: (value: number) => string

  private config = {
    keyboardSupport: false,
    animate: true,
    animationDuration: 300,
    start: [] as Array<number>, // [0, 4, 6, 10],
    step: 1,
    connect: [] as Array<boolean>, // [false, true, false, true, false],
    margin: 0,
    // limit: 4,
    behaviour: '',
    range: {
      min: 0,
      max: 0,
    },
    //  tooltips: [true, true, true, true, true, true],
    // { from: function(value) { return 'a' }, to: function(value){ return 'A'}}, { to: function(value){
    //    return 'A'}},{ to: function(value){ return 'A'}},{ to: function(value){
    //    return 'A'}},{ to: function(value){ return 'A'}}],
    pips: {
      mode: 'values',
      density: 100,
      values: [] as Array<number>, // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      format: {
        // This will give the display value for the axis.  i.e. convert from index to display value
        to: (value: number) => {
          return ''
        },
        from: (value: string) => {
          // value is string
          // When calling set this will be invoked
          // Can allow consumer to inject formatting functions
          // and use this to return reporting periods
          // const result =
          // ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V'][value]
          // const result = 2000 - Number(value.replace('FY ', ''))
          return 0
          // return result === -1 ? 0 : result
        },
      },
    },
  }

  // Use previousValues to avoid emitting duplicate change events
  private previousValues: Array<number>

  private slider: any = {}

  public updateValues(values: Array<number>) {
    this.slider.noUiSlider.set(values)
  }

  public get getValues() : Array<number> {
    return this.slider.noUiSlider.get()
  }

  private defaultRangeAxisFormatter = (value: number) => value.toString()

  private get sliderId() {
    if (this.id === undefined) {
      return this.uniqueId()
    }
    return this.id
  }

  private uniqueId = () => {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return 'date-range-slider-' + s4() + s4()
  }

  private async mounted() {
    const configuration = this.config
    this.previousValues = this.startingHandlePositions
    configuration.start = this.startingHandlePositions
    // Want array with length 1 longer than start with alternating false, true values
    configuration.connect = [...Array(configuration.start.length + 1).keys()].map(val => val % 2 === 1)
    configuration.behaviour = this.behavior
    configuration.range = { min: this.startingRangeValue, max: (this.startingRangeValue + this.numberOfRanges) }
    configuration.pips.values = [...Array(this.numberOfRanges).keys()].map(val => this.startingRangeValue + val)
    configuration.pips.format.to = this.rangeAxisFormatter || this.defaultRangeAxisFormatter

    this.slider = this.$refs[this.sliderId]
    noUiSlider.create(this.slider, configuration)


    // Fire Event if new value is set with the slider
    this.slider.noUiSlider.on('set', (values: any, handle: any, unencoded: any, tap: any, positions: any) => {
      this.onSliderChanged(values, handle, unencoded, tap, positions)
      const newValues = this.slider.noUiSlider.get()
      // This is an array of primitives and order should align so JSON.stringify
      // should return identical json for identical arrays. Avoid comparing item by item.
      if (JSON.stringify(newValues) !== JSON.stringify(this.previousValues)) {
        this.previousValues = newValues
        this.$emit('slider-changed', newValues, handle, unencoded, tap, positions)
      }
    })

    await this.$nextTick()
    const handles = this.slider.getElementsByClassName('noUi-handle')
    for (let i = 0; i < handles.length; i++) {
      const className = i % 2 === 0 ? 'noUi-handle-left' : 'noUi-handle-right'
      handles[i].classList.add(className)
      handles[i].classList.add('noUi-handle-' + i)
    }

    const pips = this.slider.getElementsByClassName('noUi-value')
    const left1 = (pips[0] as any).style.left.replace('%', '')
    const left2 = (pips[1] as any).style.left.replace('%', '')
    const adjustment = (Number(left2) - Number(left1)) / 2
    let pip: { style?: { left: string } } & Element
    for (pip of pips) {
      const newStyle = pip.style!.left.replace('%', '').toString()
      const left = Number(newStyle)
      pip.style!.left = left + adjustment + '%'
    }

    this.slider.noUiSlider.set(this.startingHandlePositions)
  }

  private onSliderChanged(values: any, handle: any, unencoded: any, tap: any, positions: any) {
    const isMatchingHandleToTheRight = handle % 2 === 0
    const marginIndexAdjustment = isMatchingHandleToTheRight ? 1 : -1

    // Handles from one grouping cannot be on top of each other
    if (values[handle] === values[handle + marginIndexAdjustment]) {
      // Reset
      // Need to get step value to update
      const steps = this.slider.noUiSlider.steps()[handle]
      // If we are looking right then to reset take the first index otherwise the 2nd.
      // Also adjust sign so that we move either left or right
      const stepAdjustment = steps[isMatchingHandleToTheRight ? 0 : 1] * marginIndexAdjustment * -1
      const nextStepValue = unencoded[handle + marginIndexAdjustment] + stepAdjustment
      this.slider.noUiSlider.setHandle(handle, nextStepValue)
    }

    if (Math.abs(values[handle] - values[handle + marginIndexAdjustment]) < this.minHandleSeparation) {
      const steps = this.slider.noUiSlider.steps()[handle]
      const stepAdjustment =
        steps[isMatchingHandleToTheRight ? 1 : 0] * marginIndexAdjustment * -this.minHandleSeparation
      const nextStepValue = unencoded[handle + marginIndexAdjustment] + stepAdjustment
      this.slider.noUiSlider.setHandle(handle, nextStepValue)
    }

    if (Math.abs(values[handle] - values[handle + marginIndexAdjustment]) > this.maxHandleSeparation) {
      const steps = this.slider.noUiSlider.steps()[handle]
      const stepAdjustment =
        steps[isMatchingHandleToTheRight ? 1 : 0] * marginIndexAdjustment * -this.maxHandleSeparation
      const nextStepValue = unencoded[handle + marginIndexAdjustment] + stepAdjustment
      this.slider.noUiSlider.setHandle(handle, nextStepValue)
    }
  }
}
</script>

<style>
.noUi-handle {
  width: 8px !important;
  right: -4px !important; /* The 17 here is half of the 34 width. The - pulls it in the other direction */
  cursor: ew-resize !important;
  opacity: 1 !important;
  background-color: #dedede;
  border-color: #bbb;
}
.noUi-value {
  margin-top: -2px!important;
}
.noUi-handle::before {
  left: 1.25px !important;
  background-color: #bbb;
}
.noUi-handle::after {
  left: 3.5px !important;
  color: blue;
  background-color: #bbb;
}
.noUi-connect {
  cursor: grab !important;
  background: #0092bc !important;
  opacity: 0.25;
}
.noUi-pips-horizontal {
  margin-top: -33px;
  font-size: smaller;
  font-family: 'Open Sans, Helvetica, Segoe UI, Verdana, Roboto, Arial, sans-serif';
}
.noUi-marker-horizontal.noUi-marker {
  height: 0;
}
.noUi-handle-left {
  right: -8px !important;
}
.noUi-handle-right {
  right: 0px !important;
}
.noUi-handle-0 {
  background-color: #e7eaf6; /* rgba(135,0,188, .2); */
}
.noUi-handle-1 {
  background-color: #e7eaf6; /* rgba(135,0,188, .2); */
}
.noUi-handle-2 {
  background-color: #e7eaf6; /* rgba(135,0,188, .2); */
  /* background-color: #a2a8d3; /* rgba(0,109,141, 0.2); */
}
.noUi-handle-3 {
  background-color: #e7eaf6; /* rgba(135,0,188, .2); */
  /* background-color: #a2a8d3; /* rgba(0,109,141, 0.2); */
}
.noUi-handle-4 {
  background-color: #38598b; /* rgba(52,188,0, 0.2); */
}
.noUi-handle-5 {
  background-color: #38598b; /* rgba(52,188,0, 0.2); */
}
</style>
