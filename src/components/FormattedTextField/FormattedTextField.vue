<template>
  <div>
    <v-text-field
      :ref="uniqueId"
      v-model="formattedValue"
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
      @blur="onBlur"
      @update:error="onErrorUpdate"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

import { presentationFormatKind } from '@vuescape/index'
import { formatValue } from '@vuescape/infrastructure/presentationFormatter'
import { should } from 'chai'

@Component({ components: {} })
export default class FormattedTextField extends Vue {
  private errorVal = false
  private errorMessagesVal: Array<string> = []

  @Prop({ type: String, required: false })
  private uniqueId: string

  @Prop({ type: [String, Number], default: '' })
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

    const result = formatValue(
      this.formatKind,
      this.value ? this.value.toString() : '',
      this.formatOptions.numberOfDecimalPlaces,
      this.valueWhenEmpty,
    )

    this.repositionCursor(result)
    return result
  }

  private set formattedValue(formattedValue: string) {
    formattedValue = this.removeDecimalsEndingWithTwoZeroes(formattedValue)!
    // convert
    const valueAsNumber = this.toNumber(formattedValue)
    this.validateTextField(valueAsNumber, this.rules)

    // if (!this.errorVal) {
    this.$emit('input', valueAsNumber)
    // }
  }

  private removeDecimalsEndingWithTwoZeroes(val: string | undefined) {
    if (typeof val === 'string' && !val) {
      return val
    }
    val!.toString().endsWith('.00')
    const decimalMatches = val!.toString().match(/\.00$/g)
    if (decimalMatches && decimalMatches.length === 1) {
      return val!.toString().replace('.00', '')
    }

    return val
  }

  private onKeyPress(e: any) {
    const keyCode = e.keyCode ? e.keyCode : e.which
    // 46 is dot
    const shouldAllowDecimal = this.formatOptions && this.formatOptions.numberOfDecimalPlaces !== 0
    if (shouldAllowDecimal && keyCode === 46) {
      // allow .
    } else if (keyCode < 48 || keyCode > 57) {
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
    this.setCursor(el, positionFromEnd)
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

  private onBlur(value: any) {
    const valueAsNumber = this.toNumber(this.formattedValue)
    this.validateTextField(valueAsNumber, this.rules)
  }

  private toNumber(formattedValue: string) {
    if (formattedValue === '') {
      return this.valueWhenEmpty
    }

    const characters = formattedValue
    let result = ''
    let hasFoundLeadingZero = false
    let index = 0
    for (const character of characters) {
      if (this.isInteger(character)) {
        if (character === '0' && result.length === 0) {
          hasFoundLeadingZero = true
        } else {
          result += character
        }
      } else {
        if ((character === '-' && index === 0) || (character === '+' && index === 0) || character === '.') {
          result += character
        }
      }
      index++
    }

    if (characters[0] === '(' && characters[characters.length - 1] === ')' && result) {
      result = '-' + result
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
    this.errorVal = this.error
    this.errorMessagesVal = this.errorMessagesVal
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
