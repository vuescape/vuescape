import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import expect from 'expect'
import Vuetify from 'vuetify'

import DownloadFileButton from './DownloadFileButton.vue'

import VueScapeButton from '../VuescapeButton'
console.log(VueScapeButton.version)

describe('DownloadFileButton.vue --', () => {
  describe('props --', () => {
    it('should set shouldShowCompletedMessage', () => {
      const shouldShowCompletedMessage = true
      const wrapper = mount(DownloadFileButton, { propsData: { shouldShowCompletedMessage } })

      // tslint:disable-next-line: no-string-literal
      expect(wrapper.props()['shouldShowCompletedMessage']).toBe(shouldShowCompletedMessage)
    })
  })

  describe('download button --', () => {
    it('should invoke onClick method', () => {
      // Arrange
      let wasClicked = false
      const localVue = createLocalVue()
      localVue.use(Vuetify)

      const wrapper = mount(DownloadFileButton, {
        propsData: {
          onClick: () => {
            wasClicked = true
          },
          isDisabled: false,
        },
        localVue,
      })

      // Act
      wrapper.find('.vuescape-button__v-btn--style').trigger('click')

      // Assert
      expect(wasClicked).toBe(true)
    })

    it('should not invoke onClick when disabled', () => {
      // Arrange
      let wasClicked = false
      const localVue = createLocalVue()
      localVue.use(Vuetify)

      const wrapper = mount(DownloadFileButton, {
        propsData: {
          onClick: () => {
            wasClicked = true
          },
          isDisabled: true,
        },
        localVue,
      })

      // Act
      wrapper.find('.vuescape-button__v-btn--style').trigger('click')

      // Assert
      expect(wasClicked).toBe(false)
    })
  })
})
