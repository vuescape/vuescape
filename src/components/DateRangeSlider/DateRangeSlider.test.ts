import { shallowMount } from '@vue/test-utils'
import { expect } from 'expect'

import DateRangeSlider from './DateRangeSlider.vue'

describe('DateRangeSlider.vue --', () => {
  describe('props --', () => {
    it('should set minHandleSeparation', () => {
      const minHandleSeparation = 10

      const wrapper = shallowMount(DateRangeSlider, {
        props: {
          minHandleSeparation,
          startingHandlePositions: [1],
        },
      })
      expect((wrapper.props() as Record<string, unknown>).minHandleSeparation).toBe(minHandleSeparation)
    })

    it('should set maxHandleSeparation', () => {
      const maxHandleSeparation = 10

      const wrapper = shallowMount(DateRangeSlider, {
        props: {
          maxHandleSeparation,
          startingHandlePositions: [1],
        },
      })
      expect((wrapper.props() as Record<string, unknown>).maxHandleSeparation).toBe(maxHandleSeparation)
    })

    it('should set startingRangeValue', () => {
      const startingRangeValue = 2019

      const wrapper = shallowMount(DateRangeSlider, {
        props: {
          startingRangeValue,
          startingHandlePositions: [1],
        },
      })
      expect((wrapper.props() as Record<string, unknown>).startingRangeValue).toBe(startingRangeValue)
    })

    it('should set numberOfRanges', () => {
      const numberOfRanges = 10

      const wrapper = shallowMount(DateRangeSlider, {
        props: {
          numberOfRanges,
          startingHandlePositions: [1],
        },
      })
      expect((wrapper.props() as Record<string, unknown>).numberOfRanges).toBe(numberOfRanges)
    })

    it('should set startingHandlePositions', () => {
      const startingHandlePositions = [10, 20, 30, 40]

      const wrapper = shallowMount(DateRangeSlider, {
        props: {
          startingHandlePositions,
          numberOfRanges: 200,
        },
      })
      expect((wrapper.props() as Record<string, unknown>).startingHandlePositions).toEqual(startingHandlePositions)
    })

    it('should set id', () => {
      const id = 'test-slider-id'

      const wrapper = shallowMount(DateRangeSlider, {
        props: {
          id,
          startingHandlePositions: [1],
        },
      })
      expect((wrapper.props() as Record<string, unknown>).id).toBe(id)
    })
  })
})
