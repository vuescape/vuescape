import { createLocalVue, shallowMount } from '@vue/test-utils'
import expect from 'expect'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

import { AppInfoModuleName, AppInfoOperation, AppInfoStore } from '@vuescape/store/modules/AppInfo'
import { rootStoreOptions } from '@vuescape/store/modules/Root'
import { makeStoreModule, ns } from '@vuescape/store/modules/types'
import { registerDynamicModule } from '@vuescape/store/registerDynamicModule'

import { withSuccessResponse } from '@vuescape/test/mockHttpClient'

import TheFooter from '.'

const theFooterConfiguration = {
  copyrightName: 'Vuescape',
  logoAltText: 'Vuescape',
  logoUrl: '/images/logo.png',
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
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      localVue.use(Vuex)
      const store = new Vuex.Store(rootStoreOptions)
      registerDynamicModule('theFooter/configuration', makeStoreModule(theFooterConfiguration), store, false)

      // Act
      const wrapper = shallowMount(TheFooter, { store, localVue })

      // Assert
      const footerHtml = wrapper.find('v-flex-stub')
      const footerText = footerHtml.text()
      expect(footerText).toContain(currentYear)
    })

    it('should contain the copyright symbol', async done => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      localVue.use(Vuex)
      const store = new Vuex.Store(rootStoreOptions)
      registerDynamicModule(AppInfoModuleName, () => new AppInfoStore(), store, false)
      registerDynamicModule('theFooter/configuration', makeStoreModule(theFooterConfiguration), store, false)

      // Act
      const wrapper = shallowMount(TheFooter, { store, localVue })

      // Assert
      const footerHtml = wrapper.find('v-flex-stub')
      const copyrightSymbol = footerHtml.text().substring(0, 1)
      expect(copyrightSymbol).toBe('©')
      done()
    })
  })

  describe('version number --', () => {
    it('should be empty when appInfo is not retrieved', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      localVue.use(Vuex)

      const store = new Vuex.Store(rootStoreOptions)
      registerDynamicModule('theFooter/configuration', makeStoreModule(theFooterConfiguration), store, false)

      // Act
      const wrapper = shallowMount(TheFooter, { store, localVue })
      // Assert
      const versionHtml = wrapper.find('.the-footer__version--center')
      const versionText = versionHtml.text()
      expect(versionText).toBe('')
    })

    it('should contain the current version when appInfo is retrieved', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      localVue.use(Vuex)

      const store = new Vuex.Store(rootStoreOptions)
      registerDynamicModule(AppInfoModuleName, () => new AppInfoStore(), store, false)
      registerDynamicModule('theFooter/configuration', makeStoreModule(theFooterConfiguration), store, false)
      const appVersion = '127.0.0.1'

      const request = () => store.dispatch(ns(AppInfoModuleName, AppInfoOperation.Action.FetchAppInfo))
      const response = { version: appVersion, isSiteInMaintenanceMode: false, siteMaintenanceMessage: '' }

      // Act
      const wrapper = shallowMount(TheFooter, { store, localVue })
      await withSuccessResponse(request, response)

      // Assert
      const versionHtml = wrapper.find('.the-footer__version--center')
      const versionText = versionHtml.text()
      expect(versionText).toContain(appVersion)
    })
  })
})
