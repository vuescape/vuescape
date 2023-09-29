import { createLocalVue, shallowMount } from '@vue/test-utils'
import expect from 'expect'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

import { AppInfoModuleName, AppInfoStore } from '@vuescape/store/modules/AppInfo'
import { rootStoreOptions } from '@vuescape/store/modules/Root'
import { makeStoreModule } from '@vuescape/store/modules/types'
import { registerDynamicModule } from '@vuescape/store/storeHelpers'

import TheFooter from '.'

const theFooterConfiguration = {
  copyrightName: 'Vuescape',
  logoAltText  : 'Vuescape',
  logoUrl      : '/images/logo.png',
}

describe('TheFooter.vue --', () => {
  // Share store between tests because even new instance is still sharing some values
  // Vue recommends cloning https://vue-test-utils.vuejs.org/guides/using-with-vuex.html
  // of arg StoreOptions<T>:
  // "Notice that we use cloneDeep to clone the store config before creating a store with it.
  // This is because Vuex mutates the options object used to create the store. To make sure we
  // have a clean store in each test, we need to clone the storeConfig object."
  //
  // When creating a new store module it already exists in the store
  // which causes an error when trying to unregister the module during the
  // registerDynamicModule call so pass false to not unregister.
  // let store: Store<RootState>
  before(() => {
    // const store = new Vuex.Store(new RootStore())
    // registerDynamicModule(AppInfoModuleName, () => new AppInfoStore(), store, false)
  })

  describe('when rendered --', () => {
    it('should contain the current year as the copyright year', async () => {
      // Arrange
      const currentYear = new Date().getFullYear()
      const localVue    = createLocalVue()
      localVue.use(Vuetify)
      localVue.use(Vuex)
      const store = new Vuex.Store(rootStoreOptions)
      registerDynamicModule(store, 'theFooter/configuration', makeStoreModule(theFooterConfiguration), false)

      // Act
      const wrapper = shallowMount(TheFooter,
        {
          store,
          localVue,
        },
      )

      // Assert
      const footerHtml = wrapper.find('.the-footer__copyright')
      const footerText = footerHtml.text()
      expect(footerText).toContain(currentYear)
    })

    it('should contain the copyright symbol', async done => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      localVue.use(Vuex)
      const store = new Vuex.Store(rootStoreOptions)
      registerDynamicModule(store, AppInfoModuleName, () => new AppInfoStore(), false)
      registerDynamicModule(store, 'theFooter/configuration', makeStoreModule(theFooterConfiguration), false)

      // Act
      const wrapper = shallowMount(TheFooter,
        {
          store,
          localVue,
        },
      )

      // Assert
      const footerHtml      = wrapper.find('.the-footer__copyright')
      const copyrightSymbol = footerHtml.text().substring(0, 1)
      expect(copyrightSymbol).toBe('©')
      done()
    })
  })
})
