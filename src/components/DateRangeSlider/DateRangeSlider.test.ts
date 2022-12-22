import { shallowMount } from '@vue/test-utils'
import expect from 'expect'

import DateRangeSlider from './DateRangeSlider.vue'

describe('DateRangeSlider.vue --', () => {
  describe('props --', () => {
    it('should set minHandleSeparation', () => {
      const minHandleSeparation = 10

      const wrapper = shallowMount(DateRangeSlider, {
        propsData: {
          minHandleSeparation,
          startingHandlePositions: [1],
        },
      })

      // tslint:disable-next-line: no-string-literal
      expect(wrapper.props()['minHandleSeparation']).toBe(minHandleSeparation)
    })

    it('should set maxHandleSeparation', () => {
      const maxHandleSeparation = 10

      const wrapper = shallowMount(DateRangeSlider, {
        propsData: {
          maxHandleSeparation,
          startingHandlePositions: [1],
        },
      })

      // tslint:disable-next-line: no-string-literal
      expect(wrapper.props()['maxHandleSeparation']).toBe(maxHandleSeparation)
    })

    it('should set startingRangeValue', () => {
      const startingRangeValue = 2019

      const wrapper = shallowMount(DateRangeSlider, {
        propsData: {
          startingRangeValue,
          startingHandlePositions: [1],
        },
      })

      // tslint:disable-next-line: no-string-literal
      expect(wrapper.props()['startingRangeValue']).toBe(startingRangeValue)
    })

    it('should set numberOfRanges', () => {
      const numberOfRanges = 10

      const wrapper = shallowMount(DateRangeSlider, {
        propsData: {
          numberOfRanges,
          startingHandlePositions: [1],
        },
      })

      // tslint:disable-next-line: no-string-literal
      expect(wrapper.props()['numberOfRanges']).toBe(numberOfRanges)
    })

    it('should set startingHandlePositions', () => {
      const startingHandlePositions = [10, 20, 30, 40]

      const wrapper = shallowMount(DateRangeSlider, {
        propsData: {
          startingHandlePositions,
          numberOfRanges: 200,
        },
      })

      // tslint:disable-next-line: no-string-literal
      expect(wrapper.props()['startingHandlePositions']).toBe(startingHandlePositions)
    })

    it('should set id', () => {
      const id = 'test-slider-id'

      const wrapper = shallowMount(DateRangeSlider, {
        propsData: {
          id,
          startingHandlePositions: [1],
        },
      })

      // tslint:disable-next-line: no-string-literal
      expect(wrapper.props()['id']).toBe(id)
    })
  })
})
