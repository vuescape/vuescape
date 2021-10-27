<template>
  <div>
    <v-text-field
      :key="key"
      :ref="uniqueId"
      :value="formattedValue"
      :label="label"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :outline="outline"
      :hide-details="hideDetails"
      :error="errorVal"
      :error-messages="errorMessagesVal"
      :clearable="clearable"
      :backgroundColor="backgroundColor"
      :prefix="prefix"
      :suffix="suffix"
      v-bind="additionalTextFieldProperties"
      @keypress="onKeyPress"
      @update:error="onErrorUpdate"
      @input="onInput"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

import { Guid, presentationFormatKind } from '@vuescape/index'
import { formatValue } from '@vuescape/infrastructure/presentationFormatter'

@Component({ components: {} })
export default class NumericTextField extends Vue {
  private errorVal = false
  private errorMessagesVal: Array<string> = []
  private rawValue: Array<number | string> = []

  private key = Guid.newGuid()

  @Prop({ type: String, required: false })
  private uniqueId: string

  @Prop({ type: String, default: '' })
  private value: string

  @Prop({ type: String, default: '' })
  private label: string

  @Prop({ type: String, default: undefined })
  private placeholder: string

  @Prop({ type: Boolean, default: false })
  private readonly: boolean

  @Prop({ type: Boolean, default: false })
  private error: boolean

  @Prop({ type: Array, default: () => [] })
  private errorMessages: Array<string>

  @Prop({ type: Array, default: () => [] })
  private rules: Array<(val: string) => boolean | string>

  @Prop({ type: Boolean, default: false })
  private hideDetails: boolean

  @Prop({ type: Boolean, default: false })
  private disabled: boolean

  @Prop({ type: Boolean, default: false })
  private outline: boolean

  @Prop({ type: Boolean, default: false })
  private clearable: boolean

  @Prop({ type: String, default: 'white' })
  private backgroundColor: boolean

  @Prop({ type: String, default: '' })
  private prefix: string

  @Prop({ type: String, default: '' })
  private suffix: string

  @Prop({ type: String, default: '' }) // or '0' or null
  private valueWhenEmpty: string

  @Prop({ type: String, default: 'number' })
  private formatKind: presentationFormatKind

  @Prop({ type: Object, required: false })
  private formatOptions: any

  @Prop({ type: Object, required: false })
  private additionalTextFieldProperties: any

  private get formattedValue() {
    if (this.formatKind !== 'number') {
      throw Error('Unsupported formatKind: ' + this.formatKind)
    }

    let value = this.rawValue[0]

    // Used for any text to the right of a decimal.
    // Will format the left portion and then append the
    // decimal suffix
    let valueSuffix = ''
    if (value) {
      const valueString = value.toString()
      const decimalIndex = valueString.indexOf('.')
      if (decimalIndex !== -1) {
        value = valueString.substring(0, decimalIndex)
        valueSuffix = valueString.substring(decimalIndex)
      }
    }

    let result = formatValue(
      this.formatKind,
      value ? value.toString() : '',
      this.formatOptions.numberOfDecimalPlaces,
      this.valueWhenEmpty,
    )

    if (valueSuffix) {
      result += valueSuffix
    }

    // Manually update the v-text-field lazy value to reflect the actual value
    // This accounts for scenario where the value does not change but the formatted output
    // is changed -- v-text-field was not rendering in that scenario
    const component = this.$refs[this.uniqueId] as any
    if (component) {
      component.lazyValue = result
    }

    this.repositionCursor(result)
    return result
  }

  @Watch('errorMessages')
  private onErrorMessagesChanged(newVal: Array<string>, oldVal: Array<string>) {
    this.errorMessagesVal = newVal
  }

  private setFormattedValue(formattedValue: string) {
    // convert
    formattedValue = this.toNumber(formattedValue)
    const valueAsNumber = this.removeDecimalsEndingWithAtLeastTwoZeroes(formattedValue)!
    this.rawValue = [valueAsNumber]
    this.$emit('input', valueAsNumber)
    this.validateTextField(valueAsNumber, this.rules)
  }

  private removeDecimalsEndingWithAtLeastTwoZeroes(val: string | undefined) {
    if (typeof val === 'string' && !val) {
      return val
    }
    const decimalMatches = val!.toString().match(/\.0{2,}$/g)
    if (decimalMatches && decimalMatches.length === 1) {
      return val!.toString().replace(decimalMatches[0], '')
    }

    return val
  }

  private onInput(val: any) {
    this.setFormattedValue(val)
  }

  private onKeyPress(e: any) {
    const DECIMAL = 46
    const keyCode = e.keyCode ? e.keyCode : e.which

    const shouldAllowDecimal = this.formatOptions && this.formatOptions.shouldAllowDecimal
    if (shouldAllowDecimal && keyCode === DECIMAL) {
      // Allow decimal
    } else if (keyCode < 48 || keyCode > 57) {
      // Disallow non-numeric
      e.preventDefault()
    }
  }

  private validateTextField(valueToValidate: string, rules: Array<(val: string) => boolean | string>) {
    const errorMessages: Array<string> = []
    for (const rule of rules) {
      const isValidOrErrorMessage = rule(valueToValidate)
      if (isValidOrErrorMessage !== true) {
        errorMessages.push(isValidOrErrorMessage.toString())
      }
    }

    this.errorVal = errorMessages.length !== 0
    if (this.errorVal) {
      this.errorMessagesVal = errorMessages
    } else {
      this.errorMessagesVal.splice(0)
    }
  }

  private repositionCursor(value: string) {
    const component = this.$refs[this.uniqueId] as Vue
    if (!component) {
      return
    }

    const componentElement = component.$el
    const el = componentElement.querySelector('input') as HTMLInputElement

    const currentPositionFromEnd = el.value.length - (el.selectionEnd || 0)
    const positionFromEnd = value.length - currentPositionFromEnd
    const adjustedPositionFromEnd = positionFromEnd >= 0 ? positionFromEnd : 0

    this.setCursor(el, adjustedPositionFromEnd)
  }

  private setCursor(el: any, position: number) {
    const setSelectionRange = () => {
      el.setSelectionRange(position, position)
    }
    if (el === document.activeElement) {
      setSelectionRange()
      setTimeout(setSelectionRange, 1) // Android Fix
    }
  }

  private onErrorUpdate(isError: boolean) {
    const textField = (this.$refs[this.uniqueId] as unknown) as any
    if (isError) {
      setTimeout(() => textField.$el.classList.add('formatted-text-field__shake'), 1)
    } else {
      setTimeout(() => textField.$el.classList.remove('formatted-text-field__shake'), 1)
    }
    this.$emit('error-messages-changed', this.errorMessagesVal)
  }

  private toNumber(formattedValue: string) {
    if (formattedValue === '') {
      return this.valueWhenEmpty
    }

    const characters = Array.from(formattedValue)
    let result = ''
    let hasFoundLeadingZero = false
    let index = 0

    for (const character of characters) {
      if (this.isInteger(character)) {
        // Leading 0 if the character is a 0 and we haven't found any other characters
        // and the next character after is not a . (supports 0.01)
        if (
          character === '0' &&
          result.length === 0 &&
          characters.length >= index + 2 &&
          characters[index + 1] !== '.'
        ) {
          hasFoundLeadingZero = true
        } else {
          result += character
        }
      } else {
        // Allowed characters other than integers
        if (character === '.' || (character === '-' && index === 0) || (character === '+' && index === 0)) {
          result += character
        }
      }
      index++
    }

    if (hasFoundLeadingZero && !result) {
      result = '0'
    }

    return result
  }

  private isInteger(value: string) {
    const result = Number.isInteger(parseInt(value, 10))
    return result
  }

  private created() {
    this.rawValue = [this.value]
    this.errorVal = this.error
    this.errorMessagesVal = this.errorMessages
  }
}
</script>

<style>
.formatted-text-field__shake {
  animation: formatted-text-field__shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}
@keyframes formatted-text-field__shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
