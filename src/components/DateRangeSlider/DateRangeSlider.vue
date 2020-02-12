<template>
  <div>
    <div :ref="sliderId" :id="sliderId" style="margin-right: 5px;"></div>
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
      mode: 'values' as 'range' | 'steps' | 'positions' | 'count' | 'values',
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

  public get getValues(): Array<number> {
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
    configuration.range = { min: this.startingRangeValue, max: this.startingRangeValue + this.numberOfRanges }
    configuration.pips.values = [...Array(this.numberOfRanges).keys()].map(val => this.startingRangeValue + val)
    configuration.pips.format = {
      to: this.rangeAxisFormatter || this.defaultRangeAxisFormatter,
      from: (value: string) => 0,
    }

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

    // Adjust the pip locations to place between the actual pips so that the text is centered
    // between the handles
    const startOfPipPercentage = (pips[0] as any).style.left.replace('%', '')

    // Default to  one pip so allocate 100% for this pip
    const endOfPipPercentage = pips.length > 1 ? (pips[1] as any).style.left.replace('%', '') : 100

    const percentAdjustment = (Number(endOfPipPercentage) - Number(startOfPipPercentage)) / 2
    let pip: { style?: { left: string } } & Element
    for (pip of pips) {
      const currentPipLeftPercent = pip.style!.left.replace('%', '').toString()
      const currentPipLeftPercentNumber = Number(currentPipLeftPercent)
      // Take the current pip location and add the adjustment to the right
      pip.style!.left = currentPipLeftPercentNumber + percentAdjustment + '%'
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
  content: url('./handle.svg') !important;
  height: 23px !important;
  width: 6px !important;
  top: 0.1px !important;
  border: unset;
  border-radius: unset;
  background: unset;
  cursor: ew-resize;
  box-shadow: unset;
  background: unset;
}
.noUi-value {
  font-weight: 400;
  font-size: 12px;
  margin-top: -5px !important;
  color: rgba(0, 0, 0, 0.87) !important;
}
.noUi-horizontal {
  height: 24px;
}
.noUi-horizontal .noUi-handle {
  top: 7px;
  height: 10px;
  color: rgba(0, 0, 0, 0.87);
}
.noUi-handle::before {
  content: none;
  /* left: 1.25px !important;
  background-color: #bbb; */
}
.noUi-handle::after {
  content: none;
  /* border-left: 1px solid rgba(0, 0, 0, 0.87);
  left: 1.5px !important; */
  /* height: 23px;
  top: -8px; */
}
.noUi-connect {
  cursor: grab !important;
  background: rgba(0, 0, 0, 0.3) !important;
  opacity: 0.25;
}
.noUi-pips-horizontal {
  margin-top: -33px;
  font-size: x-small;
}
.noUi-marker-horizontal.noUi-marker {
  height: 5.5px;
  width: 1px;
  margin-left: -0.5px;
}
.noUi-handle-left {
  right: -3px !important;
}
.noUi-handle-right {
  right: -3px !important;
}
.noUi-handle-0 {
  /* background-color: #e7eaf6; rgba(135,0,188, .2); */
}
.noUi-handle-1 {
  /* background-color: #e7eaf6; rgba(135,0,188, .2); */
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
.noUi-target {
  border-top: 1px solid rgba(0, 0, 0, 0.87);
  border-bottom: unset;
  border-right: unset;
  border-left: unset;
  border-radius: 0;
  background-color: white;
  box-shadow: unset;
}
.noUi-base {
  color: rgba(0, 0, 0, 0.87);
}
</style>
