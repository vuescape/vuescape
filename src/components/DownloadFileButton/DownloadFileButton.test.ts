import { flushPromises, mount } from '@vue/test-utils'
import { expect } from 'expect'
import { createVuetify } from 'vuetify'

import DownloadFileButton from './DownloadFileButton.vue'
// DownloadFileButton loads VuescapeButton lazily. Importing it here puts it in the test bundle, since jsdom doesn't load
// webpack's lazily loaded chunks.
import '../VuescapeButton'

describe('DownloadFileButton.vue --', () => {
  describe('props --', () => {
    it('should set shouldShowCompletedMessage', () => {
      const shouldShowCompletedMessage = true
      const wrapper                    = mount(DownloadFileButton, {
        global: { plugins: [createVuetify()] },
        props : { shouldShowCompletedMessage },
      })

      expect((wrapper.props() as Record<string, unknown>).shouldShowCompletedMessage).toBe(shouldShowCompletedMessage)
    })
  })

  describe('download button --', () => {
    it('should invoke onClick method', async () => {
      // Arrange
      let wasClicked = false

      const wrapper = mount(DownloadFileButton, {
        global: { plugins: [createVuetify()] },
        props : {
          onClick   : () => {
            wasClicked = true
          },
          isDisabled: false,
          data: '',
          shouldShowCompletedMessage: false,
        },
      })
      // The button is loaded asynchronously
      await flushPromises()

      // Act
      await wrapper.find('.vuescape-button__v-btn--style').trigger('click')

      // Assert
      expect(wasClicked).toBe(true)
    })

    it('should not invoke onClick when disabled', async () => {
      // Arrange
      let wasClicked = false

      const wrapper = mount(DownloadFileButton, {
        global: { plugins: [createVuetify()] },
        props : {
          onClick   : () => {
            wasClicked = true
          },
          isDisabled: true,
        },
      })
      // The button is loaded asynchronously
      await flushPromises()

      // Act
      await wrapper.find('.vuescape-button__v-btn--style').trigger('click')

      // Assert
      expect(wasClicked).toBe(false)
    })
  })
})
