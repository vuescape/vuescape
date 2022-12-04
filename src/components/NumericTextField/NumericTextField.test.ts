import { createLocalVue, mount } from '@vue/test-utils'
import expect from 'expect'
import Vuetify from 'vuetify'

import NumericTextField from '@vuescape/components/NumericTextField/NumericTextField.vue'

describe('NumericTextField.vue --', () => {
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
  describe('when initial value is --', () => {
    it('0 should render as 0', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '0'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('0')
    })
    it('00 should render as 0', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '00'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('0')
    })
    it('0. should render as 0.', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '0.'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('0.')
    })
    it('0.0 should render as 0.0', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '0.0'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('0.0')
    })
    it('0.00 should render as 0', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '0.00'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('0')
    })
    it('1 should render as 1', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '1'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('1')
    })
    it('12 should render as 12', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '12'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('12')
    })
    it('123 should render as 123', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '123'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('123')
    })
    it('1234 should render as 1,234', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '1234'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('1,234')
    })
    it('12345678 should render as 12,345,678', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '12345678'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('12,345,678')
    })
    it('192.168.1.1 should render as 192.168.1.1', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '192.168.1.1'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('192.168.1.1')
    })
    it('1921.168.1.1 should render as 1,921.168.1.1', async () => {
      // Arrange
      const localVue = createLocalVue()
      localVue.use(Vuetify)
      const value = '1921.168.1.1'
      const formatKind = 'number'
      const formatOptions = {
        shouldAllowDecimal: true,
        numberOfDecimalPlaces: 0,
      }

      // Act
      const wrapper = mount(NumericTextField, {
        localVue,
        propsData: {
          value,
          formatKind,
          formatOptions,
        },
      })

      // Assert
      const vm = wrapper.vm as any
      const formattedValue = vm.formattedValue
      expect(formattedValue).toEqual('1,921.168.1.1')
    })
    describe('when setting value to --', () => {
      it('1234 should render 1,234', async () => {
        // Arrange
        const localVue = createLocalVue()
        localVue.use(Vuetify)
        const value = ''
        const formatKind = 'number'
        const formatOptions = {
          shouldAllowDecimal: true,
          numberOfDecimalPlaces: 0,
        }

        // Act
        const wrapper = mount(NumericTextField, {
          localVue,
          propsData: {
            value,
            formatKind,
            formatOptions,
          },
        })

        const textInput = wrapper.find('input[type="text"]')
        textInput.setValue('1234')

        // Assert
        const vm = wrapper.vm as any
        const formattedValue = vm.formattedValue
        expect(formattedValue).toEqual('1,234')
      })
      it('00999999,999.00000 should render 999,999,999', async () => {
        // Arrange
        const localVue = createLocalVue()
        localVue.use(Vuetify)
        const value = ''
        const formatKind = 'number'
        const formatOptions = {
          shouldAllowDecimal: true,
          numberOfDecimalPlaces: 0,
        }

        // Act
        const wrapper = mount(NumericTextField, {
          localVue,
          propsData: {
            value,
            formatKind,
            formatOptions,
          },
        })

        const textInput = wrapper.find('input[type="text"]') as any
        textInput.setValue('999,999999')

        // Assert
        const vm = wrapper.vm as any
        const formattedValue = vm.formattedValue
        expect(formattedValue).toEqual('999,999,999')
      })
    })
  })
})
